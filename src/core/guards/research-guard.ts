import { GuardrailResult, StudyTopic } from '../../types';

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /you\s+are\s+now\s+(a\s+|an\s+)?(unrestricted|dan|jailbreak|pirate|developer)/i,
  /system\s+prompt/i,
  /disregard\s+all\s+guidelines/i,
  /what\s+is\s+your\s+internal\s+(system|model)\s+prompt/i,
  /as\s+an\s+ai\s+language\s+model,\s+you\s+must/i,
  /reveal\s+(the\s+)?secret/i
];

const DRIFT_TOPIC_PATTERNS = [
  /\b(tell\s+me\s+a\s+joke|write\s+a\s+poem|who\s+won\s+the\s+world\s+cup|what('?s|\s+is)\s+the\s+weather|crypto\s+price|bitcoin|recipe\s+for\s+pancakes|sing\s+a\s+song)\b/i,
  /\b(president|election|trump|biden|political\s+party|sports\s+match)\b/i
];

const PROFANITY_PATTERNS = [
  /\b(f\*{1,3}k|fuck\w*|shit\w*|bitch\w*|asshole\w*)\b/i
];

export function evaluateResearchGuard(
  userText: string,
  currentStudy: StudyTopic,
  _turnCount: number
): GuardrailResult {
  const text = userText.trim();

  // 1. Check for Prompt Injections / Jailbreak attempts
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        passed: false,
        type: 'injection',
        reason: 'Scope Guard: Adversarial prompt injection or system prompt extraction attempt detected.',
        reanchorPrompt:
          "I appreciate your curiosity! As an AI researcher for this study, my sole focus is learning about your direct experience with " +
          currentStudy.industry +
          ". Let's get right back to the study: " +
          currentStudy.starterQuestion
      };
    }
  }

  // 2. Check for Inappropriate / Hostile Language
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(text)) {
      return {
        passed: false,
        type: 'inappropriate',
        reason: 'Scope Guard: Hostile or inappropriate language detected.',
        reanchorPrompt:
          "I hear your intensity, and we really value honest, raw feedback. To help our product team fix these issues, could you share the specific task or screen that caused the most friction for you?"
      };
    }
  }

  // 3. Check for Topic Drift / Irrelevant Queries
  for (const pattern of DRIFT_TOPIC_PATTERNS) {
    if (pattern.test(text)) {
      return {
        passed: false,
        type: 'drift',
        reason: 'Scope Guard: Participant drifted from research domain into off-topic tangent.',
        reanchorPrompt:
          "Haha, I'd love to chat about that another time! But to make sure our research time counts today, I want to refocus on " +
          currentStudy.title +
          ". Could you tell me about the last roadblock you hit while working with the product?"
      };
    }
  }

  // Pass invariant
  return {
    passed: true,
    type: 'none',
    reason: 'Scope verified: Input conforms to research topic and participant persona.',
    reanchorPrompt: ''
  };
}
