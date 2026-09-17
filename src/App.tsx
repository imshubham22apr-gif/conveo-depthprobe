import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { AvatarVisualizer } from './components/AvatarVisualizer';
import { LiveDepthMeter } from './components/LiveDepthMeter';
import { TranscriptView } from './components/TranscriptView';
import { InputBar } from './components/InputBar';
import { SynthesisDashboard } from './components/SynthesisDashboard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { LoomScriptModal } from './components/LoomScriptModal';
import { PRESET_STUDIES } from './data/presetStudies';
import {
  ApiConfig,
  EvaluationMetrics,
  InterviewTurn,
  StudyTopic,
  SynthesisReport,
} from './types';
import { evaluateInformationDensity } from './core/probing/heuristic';
import { evaluateApexGuard } from './core/guards/apex-guard';
import { generateProbingQuestion } from './core/llm/client';
import { synthesizeSession } from './core/synthesis/synthesizer';
import { UnifiedSpeechRecognizer } from './core/audio/speech-recognition';
import { ttsService } from './core/audio/tts';

export function App() {
  const [activeStudy, setActiveStudy] = useState<StudyTopic>(PRESET_STUDIES[0]);
  const [turns, setTurns] = useState<InterviewTurn[]>([]);
  const [currentHypothesisIndex, setCurrentHypothesisIndex] = useState(0);
  const [currentDepthLevel, setCurrentDepthLevel] = useState(1);
  const [latestMetrics, setLatestMetrics] = useState<EvaluationMetrics | undefined>();
  const [totalProbes, setTotalProbes] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [synthesisReport, setSynthesisReport] = useState<SynthesisReport | null>(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoomOpen, setIsLoomOpen] = useState(false);

  // Config (Stored in localStorage)
  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => {
    const saved = localStorage.getItem('conveo_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      model: 'gpt-4o-mini',
      autoSpeak: true,
    };
  });

  const speechRecognizerRef = useRef<UnifiedSpeechRecognizer | null>(null);

  // Initialize Speech Recognizer
  useEffect(() => {
    speechRecognizerRef.current = new UnifiedSpeechRecognizer(apiConfig.deepgramApiKey);
    ttsService.setListener((speaking) => setIsSpeaking(speaking));
  }, []);

  // Update deepgram key when config changes
  useEffect(() => {
    if (speechRecognizerRef.current) {
      speechRecognizerRef.current.setDeepgramKey(apiConfig.deepgramApiKey);
    }
    localStorage.setItem('conveo_config', JSON.stringify(apiConfig));
  }, [apiConfig]);

  // Start study with starter question
  useEffect(() => {
    initStudySession(activeStudy);
  }, [activeStudy]);

  const initStudySession = (study: StudyTopic) => {
    ttsService.stop();
    const initialTurn: InterviewTurn = {
      id: 'turn-init-' + Date.now(),
      speaker: 'ai',
      text: study.starterQuestion,
      timestamp: Date.now(),
      turnType: 'initial_question',
      depthLevel: 1,
    };
    setTurns([initialTurn]);
    setCurrentHypothesisIndex(0);
    setCurrentDepthLevel(1);
    setTotalProbes(0);
    setLatestMetrics(undefined);
    setSynthesisReport(null);

    if (apiConfig.autoSpeak) {
      ttsService.speak(study.starterQuestion);
    }
  };

  // Toggle Microphone
  const handleToggleListening = async () => {
    if (!speechRecognizerRef.current) return;

    if (isListening) {
      speechRecognizerRef.current.stopListening();
      setIsListening(false);
      setAudioLevel(0);
    } else {
      ttsService.stop();
      setIsListening(true);
      await speechRecognizerRef.current.startListening({
        onTranscriptChange: (text, isFinal) => {
          if (isFinal && text.trim()) {
            handleSendMessage(text);
            handleToggleListening();
          }
        },
        onError: (err) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
          setAudioLevel(0);
        },
        onAudioLevel: (lvl) => setAudioLevel(lvl),
      });
    }
  };

  // Handle participant response submission
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isAnalyzing) return;

    // 1. APEX-Guard Invariant Check (Prompt Injection & Topic Drift)
    const guardResult = evaluateApexGuard(text, activeStudy, turns.length);

    // 2. Information Density Evaluation
    const metrics = evaluateInformationDensity(text);
    setLatestMetrics(metrics);

    // Add User Turn
    const userTurn: InterviewTurn = {
      id: 'user-' + Date.now(),
      speaker: 'user',
      text: text.trim(),
      timestamp: Date.now(),
      turnType: 'user_response',
      metrics,
      guardrail: guardResult,
    };

    const newTurns = [...turns, userTurn];
    setTurns(newTurns);

    // If APEX-Guard flagged a drift or injection, re-anchor immediately
    if (!guardResult.passed) {
      const guardAiTurn: InterviewTurn = {
        id: 'guard-ai-' + Date.now(),
        speaker: 'ai',
        text: guardResult.reanchorPrompt,
        timestamp: Date.now() + 200,
        turnType: 'guardrail_reanchor',
        guardrail: guardResult,
      };

      setTurns((prev) => [...prev, guardAiTurn]);
      if (apiConfig.autoSpeak) {
        ttsService.speak(guardResult.reanchorPrompt);
      }
      return;
    }

    // Otherwise, generate Socratic Depth-Probe or Hypothesis Transition
    setIsAnalyzing(true);
    try {
      const decision = await generateProbingQuestion(
        text,
        metrics,
        activeStudy,
        currentHypothesisIndex,
        currentDepthLevel,
        newTurns,
        apiConfig
      );

      const aiTurn: InterviewTurn = {
        id: 'ai-' + Date.now(),
        speaker: 'ai',
        text: decision.nextQuestion,
        timestamp: Date.now(),
        turnType: decision.turnType,
        depthLevel: decision.depthLevel,
      };

      setTurns((prev) => [...prev, aiTurn]);
      setCurrentDepthLevel(decision.depthLevel);

      if (decision.turnType === 'socratic_probe') {
        setTotalProbes((prev) => prev + 1);
      } else if (decision.turnType === 'hypothesis_transition') {
        setCurrentHypothesisIndex((prev) =>
          Math.min(activeStudy.coreHypotheses.length - 1, prev + 1)
        );
      }

      if (apiConfig.autoSpeak) {
        ttsService.speak(decision.nextQuestion);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Synthesize session into structured report
  const handleSynthesize = () => {
    ttsService.stop();
    if (speechRecognizerRef.current?.getListeningState()) {
      speechRecognizerRef.current.stopListening();
      setIsListening(false);
    }

    const report = synthesizeSession(activeStudy, turns);
    setSynthesisReport(report);

    // Celebrate with confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0e8ce6', '#38a9f6', '#10b981', '#6366f1'],
      });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <Header
        currentStudy={activeStudy}
        onSelectStudy={(study) => {
          setActiveStudy(study);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLoomScript={() => setIsLoomOpen(true)}
        onSynthesize={handleSynthesize}
        sessionActive={turns.length > 1 && !synthesisReport}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {synthesisReport ? (
          /* Synthesis Report View */
          <SynthesisDashboard
            report={synthesisReport}
            onReset={() => initStudySession(activeStudy)}
          />
        ) : (
          /* Live Interview View */
          <div className="flex flex-col gap-5 flex-1">
            {/* Top Stage: AI Moderator Avatar & HUD */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <AvatarVisualizer
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                  isAnalyzing={isAnalyzing}
                  study={activeStudy}
                  hypothesisIndex={currentHypothesisIndex}
                  totalHypotheses={activeStudy.coreHypotheses.length}
                  audioLevel={audioLevel}
                />
              </div>

              <div>
                <LiveDepthMeter
                  metrics={latestMetrics}
                  totalProbes={totalProbes}
                />
              </div>
            </div>

            {/* Middle Stage: Conversational Transcript Stream */}
            <TranscriptView turns={turns} isAnalyzing={isAnalyzing} />

            {/* Bottom Stage: Input Bar with Microphone & Presets */}
            <InputBar
              onSendMessage={handleSendMessage}
              isListening={isListening}
              onToggleListening={handleToggleListening}
              disabled={isAnalyzing}
            />
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-3 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Designed & Built by <strong className="text-slate-300">Aashish</strong> for the{' '}
            <strong className="text-conveo-400">Conveo (YC S24)</strong> Engineering Internship.
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Stack: React Router / Remix + TypeScript + Deepgram STT + Socratic LLM + APEX-Guard
          </span>
        </div>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={apiConfig}
        onSaveConfig={(newConfig) => setApiConfig(newConfig)}
      />

      <LoomScriptModal
        isOpen={isLoomOpen}
        onClose={() => setIsLoomOpen(false)}
      />
    </div>
  );
}

export default App;
