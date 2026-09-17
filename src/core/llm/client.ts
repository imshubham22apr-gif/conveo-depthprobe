import { ApiConfig, EvaluationMetrics, InterviewTurn, StudyTopic } from '../../types';
import { generateLocalSocraticProbe, ProbingDecision } from '../probing/generator';

export async function generateProbingQuestion(
  userAnswer: string,
  metrics: EvaluationMetrics,
  study: StudyTopic,
  currentHypothesisIndex: number,
  currentDepthLevel: number,
  history: InterviewTurn[],
  config?: ApiConfig
): Promise<ProbingDecision> {
  // If user provided an OpenAI API key, call the OpenAI Chat Completions API
  if (config?.openaiApiKey && config.openaiApiKey.trim().length > 0) {
    try {
      const systemPrompt = `You are an elite, highly trained Qualitative Research Moderator at Conveo.
Your mission: Conduct an in-depth Socratic qualitative interview on: "${study.title}".
Research Objective: "${study.researchObjective}"
Current Hypothesis under test (#${currentHypothesisIndex + 1}): "${study.coreHypotheses[currentHypothesisIndex]}"

CORE PRINCIPLES:
1. "Over 70% of insights come from follow-up probing questions."
2. Never accept flat, superficial answers (e.g. "it was slow", "it was confusing"). Always probe for:
   - Specificity: Which screen, button, workflow, or tool?
   - Causality: What triggered this event? What happened right before?
   - Consequence: Did they abandon the flow, use a manual workaround (like Excel), or escalate?
3. If the user's answer is high-density (detailed, grounded, with concrete entities and impact), validate it empathetically and advance to the next hypothesis.
4. Keep your question concise (1 to 2 sentences max). Talk naturally like an expert human researcher. Do not number questions or sound like a robot.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6).map(h => ({
          role: h.speaker === 'ai' ? 'assistant' : 'user',
          content: h.text
        })),
        {
          role: 'user',
          content: `Participant Answer: "${userAnswer}"\n\nEvaluator diagnostics:\n- Information Density: ${metrics.densityScore}%\n- Superficial: ${metrics.isSuperficial}\n- Probe Reason: ${metrics.probeReason}\n- Detected Entities: ${metrics.detectedEntities.join(', ') || 'None'}\n\nGenerate the next conversational Socratic probe or hypothesis transition:`
        }
      ];

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openaiApiKey}`
        },
        body: JSON.stringify({
          model: config.model || 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        if (content) {
          const isTransition = !metrics.isSuperficial && currentDepthLevel >= 2;
          return {
            nextQuestion: content,
            turnType: isTransition ? 'hypothesis_transition' : 'socratic_probe',
            depthLevel: isTransition ? 1 : currentDepthLevel + 1,
            strategyExplanation: `OpenAI (${config.model || 'gpt-4o-mini'}): ${metrics.probeReason}`
          };
        }
      }
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to local Socratic heuristic engine:', err);
    }
  }

  // Fallback / Default: Highly optimized local Socratic Probing Heuristic Engine
  return generateLocalSocraticProbe(
    userAnswer,
    metrics,
    study,
    currentHypothesisIndex,
    currentDepthLevel,
    history
  );
}
