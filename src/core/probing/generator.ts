import { EvaluationMetrics, InterviewTurn, StudyTopic } from '../../types';

export interface ProbingDecision {
  nextQuestion: string;
  turnType: 'socratic_probe' | 'hypothesis_transition';
  depthLevel: number; // 1 = surface probe, 2 = root cause probe, 3 = saturated/transition
  strategyExplanation: string;
}

/**
 * Deterministic Socratic Probe Generator
 * Generates tailored, context-aware follow-up probes based on information density gaps.
 */
export function generateLocalSocraticProbe(
  userAnswer: string,
  metrics: EvaluationMetrics,
  currentStudy: StudyTopic,
  currentHypothesisIndex: number,
  currentDepthLevel: number,
  _conversationHistory: InterviewTurn[]
): ProbingDecision {
  const text = userAnswer.toLowerCase();
  const entities = metrics.detectedEntities;

  // If user reached depth 2+ or provided high depth insight
  if (currentDepthLevel >= 2 || (!metrics.isSuperficial && metrics.densityScore >= 70)) {
    // Saturated this hypothesis -> Advance to next hypothesis or synthesize
    const nextIndex = currentHypothesisIndex + 1;
    if (nextIndex < currentStudy.coreHypotheses.length) {
      const nextHypothesis = currentStudy.coreHypotheses[nextIndex];
      return {
        nextQuestion: `That gives us crystal-clear context on the root friction. Shifting gears slightly, another area we're investigating is: ${nextHypothesis} How has your experience been with this specific aspect?`,
        turnType: 'hypothesis_transition',
        depthLevel: 1,
        strategyExplanation:
          'Depth Saturated (Density ' + metrics.densityScore + '%): Captured concrete trigger and consequence. Progressing to Hypothesis #' + (nextIndex + 1) + '.'
      };
    } else {
      return {
        nextQuestion:
          "That was exceptionally detailed and hits right at the core problem. If you had a magic wand and could redesign that exact interaction tomorrow, what is the single change that would make this an instant 10/10 experience for you?",
        turnType: 'hypothesis_transition',
        depthLevel: 3,
        strategyExplanation: 'All hypotheses saturated with qualitative depth. Probing for ideal resolution.'
      };
    }
  }

  // If superficial, probe based on specific diagnostic gaps
  let nextQuestion = '';
  let strategyExplanation = '';
  const newDepth = currentDepthLevel + 1;

  // Case A: User reported friction but didn't state what specific screen/trigger caused it
  if (metrics.frictionDetected && entities.length === 0) {
    if (text.includes('slow') || text.includes('lag')) {
      nextQuestion =
        "When you say it felt slow, what specific action were you trying to complete at that exact second? Did it freeze during data loading, or was it during an export/save?";
      strategyExplanation =
        'Targeted Probe [Latency Specificity]: Moving beyond generic "slow" to pinpoint exact screen and latency impact.';
    } else if (text.includes('confus') || text.includes('hard') || text.includes('difficult')) {
      nextQuestion =
        "What specific term or button on the screen made it feel confusing, and what did you expect would happen instead?";
      strategyExplanation =
        'Targeted Probe [Mental Model Gap]: Unpacking UI terminology mismatch vs user expectation.';
    } else if (text.includes('expensive') || text.includes('price') || text.includes('cost')) {
      nextQuestion =
        "Could you walk me through the pricing tier you were looking at? Was the issue the entry seat cost, or unexpected add-on fees as your team scaled?";
      strategyExplanation =
        'Targeted Probe [Pricing Architecture]: Isolating seat-based friction vs perceived value disparity.';
    } else {
      nextQuestion =
        "Could you pinpoint the exact screen or step in your workflow where this happened? What was the immediate next thing you did?";
      strategyExplanation =
        'Targeted Probe [Context Anchor]: Grounding generic negative sentiment into an observable event.';
    }
  }
  // Case B: Mentioned an entity (e.g. "export", "checkout", "code") but missing causality or consequence
  else if (entities.length > 0 && metrics.causalityScore < 40) {
    const primaryEntity = entities[0];
    nextQuestion = `You mentioned the ${primaryEntity}. Walk me through what happened right before that—what specific goal were you trying to accomplish, and where did the breakdown occur?`;
    strategyExplanation = `Targeted Probe [Causal Chain]: Deepening investigation around the "${primaryEntity}" workflow step.`;
  }
  // Case C: Depth 1 -> Push for Level 2 Consequence (Workaround / Business impact)
  else if (currentDepthLevel === 1) {
    nextQuestion =
      "When that roadblock happened, what was the downstream impact? Did you have to find a manual workaround (like doing it in a spreadsheet or third-party tool), or did you abandon the task entirely?";
    strategyExplanation =
      'Depth Level 2 Probe [Consequence / Workaround]: Uncovering business friction, abandoned flows, or shadow tooling.';
  }
  // Case D: General superficial one-liner (wordCount < 8)
  else {
    nextQuestion =
      "Could you give me a concrete example from the last time you encountered that? Painting a quick picture of that specific day or task helps our engineering team understand the real context.";
    strategyExplanation =
      'Brevity Recovery Probe: Rescuing flat survey response by requesting an episodic memory example.';
  }

  return {
    nextQuestion,
    turnType: 'socratic_probe',
    depthLevel: newDepth,
    strategyExplanation
  };
}
