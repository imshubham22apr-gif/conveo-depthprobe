import React, { useEffect, useRef } from 'react';
import { Bot, User, Sparkles, ShieldAlert, ArrowRight, CornerDownRight } from 'lucide-react';
import { InterviewTurn } from '../types';

interface TranscriptViewProps {
  turns: InterviewTurn[];
  isAnalyzing: boolean;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ turns, isAnalyzing }) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, isAnalyzing]);

  return (
    <div className="flex-1 bg-slate-900/60 rounded-2xl border border-slate-800 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[520px] shadow-inner">
      {turns.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
          <Bot className="w-12 h-12 mb-3 text-slate-600" />
          <p className="text-sm font-medium text-slate-400">Interview Session Ready</p>
          <p className="text-xs text-slate-500 max-w-sm mt-1">
            Click Start Interview or select a scenario above to begin the AI-driven Socratic qualitative interview.
          </p>
        </div>
      ) : (
        turns.map((turn) => {
          const isAI = turn.speaker === 'ai';

          return (
            <div
              key={turn.id}
              className={`flex gap-3 text-sm ${isAI ? 'items-start' : 'items-start flex-row-reverse'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md ${
                  isAI
                    ? 'bg-gradient-to-tr from-conveo-600 to-sky-400 text-white'
                    : 'bg-slate-800 border border-slate-700 text-slate-200'
                }`}
              >
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble Container */}
              <div
                className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
                  isAI ? 'items-start' : 'items-end'
                }`}
              >
                {/* AI Turn Badges */}
                {isAI && (
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] font-medium">
                    {turn.turnType === 'initial_question' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Initial Question
                      </span>
                    )}
                    {turn.turnType === 'socratic_probe' && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center gap-1">
                        <CornerDownRight className="w-3 h-3" />
                        Socratic Depth Probe (Level {turn.depthLevel ?? 1})
                      </span>
                    )}
                    {turn.turnType === 'hypothesis_transition' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        Hypothesis Transition
                      </span>
                    )}
                    {turn.turnType === 'guardrail_reanchor' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" />
                        APEX-Guard Re-Anchor
                      </span>
                    )}
                  </div>
                )}

                {/* Bubble Text */}
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    isAI
                      ? 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-sm'
                      : 'bg-gradient-to-r from-conveo-600 to-conveo-500 text-white rounded-tr-sm'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{turn.text}</p>
                </div>

                {/* User Turn Diagnostic Pill */}
                {!isAI && turn.metrics && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded border ${
                        turn.metrics.densityScore >= 65
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : turn.metrics.densityScore >= 45
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      Density: {turn.metrics.densityScore}%{' '}
                      {turn.metrics.isSuperficial ? '(Superficial)' : '(Deep Insight)'}
                    </span>

                    {turn.metrics.detectedEntities.slice(0, 3).map((e, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700"
                      >
                        #{e}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Analyzing Typing Indicator */}
      {isAnalyzing && (
        <div className="flex gap-3 items-start text-sm">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-conveo-600 to-sky-400 flex items-center justify-center shrink-0 shadow-md">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl rounded-tl-sm px-4 py-3 text-slate-300 flex items-center gap-2">
            <span className="text-xs text-conveo-400 font-medium">
              Evaluating information density & generating Socratic probe
            </span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-conveo-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-conveo-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-conveo-400 animate-bounce [animation-delay:0.4s]" />
            </span>
          </div>
        </div>
      )}

      <div ref={scrollEndRef} />
    </div>
  );
};
