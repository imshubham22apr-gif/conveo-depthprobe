import React from 'react';
import {
  FileText,
  Download,
  AlertOctagon,
  CheckCircle2,
  Quote,
  RotateCcw,
  Sparkles,
  Printer
} from 'lucide-react';
import { SynthesisReport } from '../types';

interface SynthesisDashboardProps {
  report: SynthesisReport;
  onReset: () => void;
}

export const SynthesisDashboard: React.FC<SynthesisDashboardProps> = ({
  report,
  onReset,
}) => {
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `conveo_synthesis_${report.sessionId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportMarkdown = () => {
    const mdContent = `# Conveo Qualitative Research Synthesis Report
**Study Title:** ${report.studyTitle}
**Generated:** ${report.generatedAt}
**Session ID:** ${report.sessionId}

## Executive Summary
${report.executiveSummary}

## Depth Probing Effectiveness (Conveo Differentiator)
- **Insights Uncovered by AI Probing:** ${report.depthProbingEffectiveness.insightsUncoveredByProbingPercent}%
- **Total Conversational Turns:** ${report.depthProbingEffectiveness.totalTurns}
- **Socratic Probes Triggered:** ${report.depthProbingEffectiveness.probesTriggered}
- **Average Information Density:** ${report.depthProbingEffectiveness.averageDensityScore}%
- **Surface Responses Rescued:** ${report.depthProbingEffectiveness.surfaceAnswersRescued}

## Key Friction Hotspots
${report.keyFrictions
  .map(
    (f) => `### [${f.severity.toUpperCase()}] ${f.title}
- **Verbatim Evidence:** "${f.verbatimQuote}"
- **Root Cause:** ${f.rootCause}
- **Suggested Action:** ${f.suggestedAction}\n`
  )
  .join('\n')}

## Prioritized Product Recommendations
${report.productRecommendations
  .map((r) => `- **[${r.priority}] ${r.action}:** ${r.rationale}`)
  .join('\n')}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `conveo_report_${report.sessionId}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 px-4 animate-in fade-in duration-500">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-conveo-400 uppercase tracking-wider">
              Conveo Research Deliverable
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              ID: {report.sessionId}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Qualitative Insight Synthesis
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{report.studyTitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-conveo-400" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleExportMarkdown}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-conveo-400" />
            <span>Export MD</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-conveo-400" />
            <span>Print / PDF</span>
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-conveo-600 hover:bg-conveo-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-md shadow-conveo-600/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Interview</span>
          </button>
        </div>
      </div>

      {/* Hero Metric: Depth Probing ROI (Conveo Core Differentiator) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-conveo-900/50 to-slate-900 rounded-2xl border border-conveo-500/30 p-5 relative overflow-hidden">
          <div className="text-conveo-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            Conveo Differentiator
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-4xl font-extrabold font-mono text-white">
              {report.depthProbingEffectiveness.insightsUncoveredByProbingPercent}%
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Insights uncovered via <strong className="text-conveo-300">AI Socratic follow-ups</strong> that flat surveys miss.
          </p>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
          <div className="text-slate-400 text-xs font-semibold mb-1">Average Information Density</div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">
            {report.depthProbingEffectiveness.averageDensityScore}%
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Elevated from initial surface responses via targeted probing.
          </p>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
          <div className="text-slate-400 text-xs font-semibold mb-1">Probes Triggered</div>
          <div className="text-3xl font-extrabold font-mono text-conveo-400 mt-2">
            {report.depthProbingEffectiveness.probesTriggered}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Across {report.depthProbingEffectiveness.totalTurns} conversational turns.
          </p>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5">
          <div className="text-slate-400 text-xs font-semibold mb-1">Urgency Index</div>
          <div className="text-3xl font-extrabold font-mono text-rose-400 mt-2">
            {report.urgencyScore} <span className="text-xs text-slate-500 font-normal">/ 10</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Based on emotional frustration & workaround cost.
          </p>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-conveo-400" />
          Executive Synthesis
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">{report.executiveSummary}</p>
      </div>

      {/* Key Friction Points */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          Uncovered Friction Hotspots
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {report.keyFrictions.map((friction) => (
            <div
              key={friction.id}
              className="bg-slate-950/60 rounded-xl border border-slate-800/80 p-4 space-y-2.5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      friction.severity === 'critical'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {friction.severity}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{friction.title}</h3>
                </div>
              </div>

              <blockquote className="text-xs text-slate-300 italic bg-slate-900/60 border-l-2 border-conveo-400 pl-3 py-1.5 rounded-r">
                "{friction.verbatimQuote}"
              </blockquote>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-slate-400 font-semibold">Root Cause: </span>
                  <span className="text-slate-300">{friction.rootCause}</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-semibold">Product Fix: </span>
                  <span className="text-slate-300">{friction.suggestedAction}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verbatim Quotes & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Direct Verbatims */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Quote className="w-4 h-4 text-conveo-400" />
            Verbatim Evidence Log
          </h2>
          <div className="space-y-2.5">
            {report.keyVerbatims.slice(0, 4).map((v, i) => (
              <div
                key={i}
                className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 text-xs space-y-1"
              >
                <p className="text-slate-200 italic">{v.quote}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{v.context}</span>
                  <span className="text-conveo-400">{v.impact} Impact</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-3">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Engineering & Product Actions
          </h2>
          <div className="space-y-2.5">
            {report.productRecommendations.map((rec, i) => (
              <div
                key={i}
                className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800/80 space-y-1 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      rec.priority === 'P0'
                        ? 'bg-rose-500/20 text-rose-300'
                        : rec.priority === 'P1'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {rec.priority}
                  </span>
                  <span className="font-bold text-slate-100">{rec.action}</span>
                </div>
                <p className="text-slate-400 text-xs pl-7">{rec.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
