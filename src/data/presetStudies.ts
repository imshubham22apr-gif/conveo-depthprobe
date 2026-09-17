import { StudyTopic } from '../types';

export const PRESET_STUDIES: StudyTopic[] = [
  {
    id: 'b2b-churn-friction',
    title: 'Enterprise SaaS Workflow & Churn Risk',
    badge: 'B2B Enterprise',
    industry: 'Cloud Software',
    targetAudience: 'Product Ops, Engineering Managers, & Team Leads',
    researchObjective:
      'Uncover the latent friction points, workflow blockades, and pricing triggers causing teams to downgrade or churn before annual renewal.',
    coreHypotheses: [
      'Users experience friction during team onboarding and workspace permissions.',
      'Reporting dashboards lack actionable export formats, forcing manual spreadsheet reconciliation.',
      'Seat-based pricing feels punitive when occasional collaborators need read-only access.'
    ],
    starterQuestion:
      "Thanks for taking the time to share your perspective. Thinking back to the past 30 days using the platform with your team, where did you feel the biggest friction or hesitation during your regular workflow?"
  },
  {
    id: 'ecommerce-cart-abandonment',
    title: 'D2C Consumer Checkout & Payment Friction',
    badge: 'Consumer & Retail',
    industry: 'E-Commerce',
    targetAudience: 'Frequent Online Shoppers & Mobile Buyers',
    researchObjective:
      'Identify subtle psychological and UX barriers at the point of payment that lead to sudden cart abandonment on mobile devices.',
    coreHypotheses: [
      'Surprise shipping fees or unclear delivery dates at the final step cause drop-off.',
      'Mandatory account creation creates friction compared to 1-click Apple Pay/Shop Pay.',
      'Return policy ambiguity reduces purchase confidence for high-ticket items.'
    ],
    starterQuestion:
      "Welcome! Think about the last time you added items to your cart on our online store but ended up closing the tab without completing the purchase. What was happening at that exact moment?"
  },
  {
    id: 'ai-dev-tools-adoption',
    title: 'AI Code Assistant Trust & Context Boundary',
    badge: 'Developer Experience',
    industry: 'DevTools & AI',
    targetAudience: 'Full-Stack & Senior Software Engineers',
    researchObjective:
      'Understand developer trust breakdown when AI coding agents make architectural decisions, hallucinates libraries, or disrupts local terminal flow.',
    coreHypotheses: [
      'Developers lose confidence when the AI edits files outside the immediate working context.',
      'Inline suggestions are accepted for boilerplate but rejected for business logic.',
      'Context windows fail on large monorepos, leading to silent regressions.'
    ],
    starterQuestion:
      "Hi there! As a software engineer working with AI code assistants in your daily IDE workflow, what is the most frustrating moment where the AI hallucinated or broke your development flow?"
  }
];
