export type Speaker = 'ai' | 'user';

export type TurnType =
  | 'initial_question'
  | 'socratic_probe'
  | 'hypothesis_transition'
  | 'guardrail_reanchor'
  | 'user_response';

export interface StudyTopic {
  id: string;
  title: string;
  badge: string;
  targetAudience: string;
  researchObjective: string;
  coreHypotheses: string[];
  starterQuestion: string;
  industry: string;
}

export interface EvaluationMetrics {
  densityScore: number; // 0 - 100
  specificityScore: number; // 0 - 100
  causalityScore: number; // 0 - 100
  emotionScore: number; // 0 - 100
  actionabilityScore: number; // 0 - 100
  detectedEntities: string[];
  frictionDetected: boolean;
  isSuperficial: boolean;
  probeReason: string;
  depthTier: 'Surface (Low Context)' | 'Emerging Context' | 'Deep Socratic Insight';
}

export interface GuardrailResult {
  passed: boolean;
  type: 'none' | 'drift' | 'injection' | 'inappropriate';
  reason: string;
  reanchorPrompt: string;
}

export interface InterviewTurn {
  id: string;
  speaker: Speaker;
  text: string;
  timestamp: number;
  turnType: TurnType;
  metrics?: EvaluationMetrics;
  guardrail?: GuardrailResult;
  depthLevel?: number; // 1 = surface, 2 = contextual, 3 = root-cause
}

export interface FrictionPoint {
  id: string;
  title: string;
  severity: 'critical' | 'moderate' | 'low';
  verbatimQuote: string;
  rootCause: string;
  suggestedAction: string;
}

export interface SynthesisReport {
  sessionId: string;
  generatedAt: string;
  studyTitle: string;
  researchObjective: string;
  executiveSummary: string;
  depthProbingEffectiveness: {
    totalTurns: number;
    probesTriggered: number;
    insightsUncoveredByProbingPercent: number; // target ~70% as per Conveo metric
    averageDensityScore: number;
    surfaceAnswersRescued: number;
  };
  keyFrictions: FrictionPoint[];
  urgencyScore: number; // 1 - 10
  sentimentSummary: string;
  keyVerbatims: Array<{
    quote: string;
    context: string;
    impact: 'High' | 'Medium' | 'Low';
  }>;
  productRecommendations: Array<{
    priority: 'P0' | 'P1' | 'P2';
    action: string;
    rationale: string;
  }>;
}

export interface ApiConfig {
  openaiApiKey?: string;
  deepgramApiKey?: string;
  model: string;
  autoSpeak: boolean;
}
