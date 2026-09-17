import { EvaluationMetrics } from '../../types';

// Keywords indicative of specific UI/system entities
const ENTITY_PATTERNS = [
  /\b(button|page|dashboard|modal|table|export|csv|api|billing|checkout|cart|shipping|payment|login|auth|permission|role|token|code|terminal|repo|git|setting|notification|invoice|subscription|plan|price|search|filter)\b/gi,
  /\b(\d+(\.\d+)?\s*(mins?|hours?|days?|sec(ond)?s?|dollars?|\$|users?|seats?|percent|%))\b/gi,
  /\b(yesterday|last week|every time|monday|daily|monthly|quarterly)\b/gi
];

// Causal connectors that demonstrate chain of reasoning
const CAUSAL_PATTERNS = [
  /\b(because|so that|in order to|due to|led to|as a result|since|when i tried to|which caused|therefore|consequently)\b/gi,
  /\b(if|unless|whenever|after clicking|before)\b/gi
];

// Emotional and friction keywords
const FRICTION_PATTERNS = [
  /\b(frustrat\w*|annoy\w*|slow\w*|confus\w*|broke\w*|crash\w*|fail\w*|buggy|waste\w*|painful|tedious|stuck|abandon\w*|gave up|quit|hated|terrible|horrible|difficult\w*|clunky|unintuitive|lag\w*)\b/gi,
  /\b(expensive|overpriced|opaque|hidden|surprise)\b/gi
];

// Behavioral workaround or resolution patterns
const ACTIONABILITY_PATTERNS = [
  /\b(workaround|had to switch|manual\w*|spreadsheet|excel|bypassed|emailed support|slack|called|hack\w*|script\w*|instead)\b/gi,
  /\b(wish there was|need\w*|should have|would prefer|better if)\b/gi
];

export function evaluateInformationDensity(text: string): EvaluationMetrics {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Specificity (0 - 100)
  const matchedEntities: string[] = [];
  ENTITY_PATTERNS.forEach(regex => {
    const matches = text.match(regex);
    if (matches) {
      matches.forEach(m => matchedEntities.push(m.toLowerCase()));
    }
  });

  // Base specificity on word length and concrete entity density
  let specificityScore = Math.min(100, (matchedEntities.length * 25) + (wordCount > 15 ? 30 : wordCount * 2));
  if (wordCount < 6) specificityScore = Math.min(specificityScore, 20);

  // 2. Causality (0 - 100)
  let causalMatches = 0;
  CAUSAL_PATTERNS.forEach(regex => {
    const matches = text.match(regex);
    if (matches) causalMatches += matches.length;
  });
  let causalityScore = Math.min(100, causalMatches * 35 + (wordCount > 20 ? 25 : 0));

  // 3. Emotion / Friction (0 - 100)
  let frictionMatches = 0;
  FRICTION_PATTERNS.forEach(regex => {
    const matches = text.match(regex);
    if (matches) frictionMatches += matches.length;
  });
  const frictionDetected = frictionMatches > 0;
  let emotionScore = Math.min(100, frictionMatches * 40 + (frictionDetected ? 20 : 0));

  // 4. Actionability / Workaround (0 - 100)
  let actionMatches = 0;
  ACTIONABILITY_PATTERNS.forEach(regex => {
    const matches = text.match(regex);
    if (matches) actionMatches += matches.length;
  });
  let actionabilityScore = Math.min(100, actionMatches * 45 + (matchedEntities.length > 1 ? 15 : 0));

  // Aggregate weighted Information Density
  // In qualitative research, Specificity & Causality carry the highest diagnostic value
  let densityScore = Math.round(
    (specificityScore * 0.35) +
    (causalityScore * 0.30) +
    (emotionScore * 0.20) +
    (actionabilityScore * 0.15)
  );

  // Penalize very short responses strongly (the classic survey 1-liner)
  if (wordCount < 8) {
    densityScore = Math.min(densityScore, 35);
  } else if (wordCount < 14 && matchedEntities.length === 0) {
    densityScore = Math.min(densityScore, 48);
  }

  // Determine superficiality and diagnostic reason
  let isSuperficial = densityScore < 60;
  let probeReason = '';

  if (wordCount < 8) {
    isSuperficial = true;
    probeReason = 'Brevity Penalty: Surface 1-liner lacks situational context or examples.';
  } else if (causalityScore < 30) {
    probeReason = 'Missing Causality: User stated what happened, but not why or what sequence triggered it.';
  } else if (specificityScore < 40) {
    probeReason = 'Low Specificity: Needs concrete workflow step, screen, or tool names.';
  } else if (actionabilityScore < 30 && frictionDetected) {
    probeReason = 'Uncovered Friction: Needs to establish user consequence or manual workaround.';
  } else {
    probeReason = 'High Diagnostic Depth: Sufficient grounded detail to advance hypothesis.';
  }

  // Determine tier
  let depthTier: EvaluationMetrics['depthTier'] = 'Surface (Low Context)';
  if (densityScore >= 75) {
    depthTier = 'Deep Socratic Insight';
  } else if (densityScore >= 50) {
    depthTier = 'Emerging Context';
  }

  return {
    densityScore,
    specificityScore,
    causalityScore,
    emotionScore,
    actionabilityScore,
    detectedEntities: Array.from(new Set(matchedEntities)),
    frictionDetected,
    isSuperficial,
    probeReason,
    depthTier
  };
}
