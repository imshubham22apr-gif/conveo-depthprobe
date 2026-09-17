import React from 'react';
import { Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { EvaluationMetrics } from '../types';

interface LiveDepthMeterProps {
  metrics?: EvaluationMetrics;
  totalProbes: number;
}

export const LiveDepthMeter: React.FC<LiveDepthMeterProps> = ({
  metrics,
  totalProbes,
}) => {
  const density = metrics?.densityScore ?? 0;
  const isSuperficial = metrics?.isSuperficial ?? true;

  // Determine color scheme
  let color = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  let barColor = 'bg-rose-500';
  let badgeText = 'Surface 1-Liner (Flat Survey)';

  if (density >= 70) {
    color = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    barColor = 'bg-emerald-500';
    badgeText = 'Deep Socratic Insight';
  } else if (density >= 45) {
    color = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    barColor = 'bg-amber-500';
    badgeText = 'Emerging Context';
  }

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-conveo-400" />
            <h3 className="text-sm font-bold text-slate-200">Information Density Engine</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Probe Count: <span className="text-conveo-400 font-bold">{totalProbes}</span>
          </span>
        </div>

        {/* Big Score & Status */}
        <div className="flex items-baseline justify-between mt-3 mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold font-mono tracking-tight text-white">
              {density}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 100%</span>
          </div>
          <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${color}`}>
            {badgeText}
          </span>
        </div>

        {/* Main Score Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full ${barColor} transition-all duration-500 ease-out`}
            style={{ width: `${density}%` }}
          />
        </div>

        {/* 4 Diagnostic Dimensions */}
        <div className="space-y-2.5 text-xs">
          {/* Specificity */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
              <span>Specificity (Entities & Screens)</span>
              <span className="font-mono text-slate-300">{metrics?.specificityScore ?? 0}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all duration-300"
                style={{ width: `${metrics?.specificityScore ?? 0}%` }}
              />
            </div>
          </div>

          {/* Causality */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
              <span>Causality (Sequence & Trigger)</span>
              <span className="font-mono text-slate-300">{metrics?.causalityScore ?? 0}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-400 transition-all duration-300"
                style={{ width: `${metrics?.causalityScore ?? 0}%` }}
              />
            </div>
          </div>

          {/* Emotion & Friction */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
              <span>Emotional Impact & Severity</span>
              <span className="font-mono text-slate-300">{metrics?.emotionScore ?? 0}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400 transition-all duration-300"
                style={{ width: `${metrics?.emotionScore ?? 0}%` }}
              />
            </div>
          </div>

          {/* Actionability */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
              <span>Actionability & Workarounds</span>
              <span className="font-mono text-slate-300">{metrics?.actionabilityScore ?? 0}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-400 transition-all duration-300"
                style={{ width: `${metrics?.actionabilityScore ?? 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Heuristic Diagnostic Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-start gap-2 text-[11px]">
          {isSuperficial ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div>
            <span className="font-semibold text-slate-200">
              {isSuperficial ? 'Probing Triggered: ' : 'Invariant Satisfied: '}
            </span>
            <span className="text-slate-400">
              {metrics?.probeReason || 'Awaiting participant input to evaluate qualitative density.'}
            </span>
          </div>
        </div>

        {metrics && metrics.detectedEntities.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {metrics.detectedEntities.map((e, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-conveo-300 border border-slate-700"
              >
                #{e}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
