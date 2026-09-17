import React from 'react';
import { Bot, Mic, Volume2, ShieldCheck, Activity, Target } from 'lucide-react';
import { StudyTopic } from '../types';

interface AvatarVisualizerProps {
  isSpeaking: boolean;
  isListening: boolean;
  isAnalyzing: boolean;
  study: StudyTopic;
  hypothesisIndex: number;
  totalHypotheses: number;
  audioLevel: number;
}

export const AvatarVisualizer: React.FC<AvatarVisualizerProps> = ({
  isSpeaking,
  isListening,
  isAnalyzing,
  study,
  hypothesisIndex,
  totalHypotheses,
  audioLevel,
}) => {
  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
      {/* Background glow when active */}
      <div
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
          isSpeaking
            ? 'bg-conveo-500/25'
            : isListening
            ? 'bg-emerald-500/20'
            : isAnalyzing
            ? 'bg-amber-500/20'
            : 'bg-slate-800/30'
        }`}
      />

      <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
        {/* Avatar Visualizer */}
        <div className="relative">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 relative ${
              isSpeaking
                ? 'bg-gradient-to-tr from-conveo-600 via-conveo-500 to-sky-400 ring-4 ring-conveo-400/40 shadow-lg shadow-conveo-500/30'
                : isListening
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 ring-4 ring-emerald-400/40 shadow-lg shadow-emerald-500/30'
                : isAnalyzing
                ? 'bg-gradient-to-tr from-amber-600 to-yellow-400 ring-4 ring-amber-400/30 animate-pulse'
                : 'bg-slate-800 border border-slate-700'
            }`}
          >
            {isSpeaking ? (
              <Volume2 className="w-10 h-10 text-white animate-bounce" />
            ) : isListening ? (
              <Mic className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Bot className="w-10 h-10 text-slate-300" />
            )}
          </div>

          {/* Status Dot */}
          <div
            className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center ${
              isSpeaking
                ? 'bg-conveo-400 animate-ping'
                : isListening
                ? 'bg-emerald-400 animate-ping'
                : isAnalyzing
                ? 'bg-amber-400'
                : 'bg-slate-600'
            }`}
          />
        </div>

        {/* AI Moderator Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
            <span className="text-sm font-bold text-slate-100">Dr. Sarah (Conveo AI Moderator)</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              APEX-Guard Active
            </span>
          </div>

          {/* Dynamic Status Text */}
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs">
            {isSpeaking ? (
              <span className="text-conveo-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-conveo-400 animate-pulse" />
                Speaking follow-up probing question...
              </span>
            ) : isListening ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Listening actively (Deepgram audio stream)...
              </span>
            ) : isAnalyzing ? (
              <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 animate-spin" />
                Evaluating Information Density & Socratic heuristic...
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                Ready for participant response
              </span>
            )}
          </div>

          {/* Audio Waveform Bars */}
          <div className="flex items-center justify-center sm:justify-start gap-1 mt-3 h-5">
            {[0.4, 0.8, 0.5, 0.9, 0.6, 1.0, 0.7, 0.4, 0.8, 0.5, 0.9, 0.3].map((factor, i) => {
              const activeScale = isSpeaking
                ? 0.3 + (i % 3) * 0.3
                : isListening
                ? Math.max(0.2, (audioLevel / 100) * factor)
                : 0.15;

              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    isSpeaking
                      ? 'bg-conveo-400'
                      : isListening
                      ? 'bg-emerald-400'
                      : 'bg-slate-700'
                  }`}
                  style={{
                    height: `${Math.max(4, Math.round(activeScale * 20))}px`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Current Hypothesis Card */}
        <div className="w-full sm:w-auto bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 text-left min-w-[240px]">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1 font-medium text-slate-300">
              <Target className="w-3 h-3 text-conveo-400" />
              Hypothesis Test
            </span>
            <span className="font-mono text-conveo-400">
              {hypothesisIndex + 1} of {totalHypotheses}
            </span>
          </div>
          <p className="text-xs text-slate-200 line-clamp-2 italic">
            "{study.coreHypotheses[hypothesisIndex]}"
          </p>
        </div>
      </div>
    </div>
  );
};
