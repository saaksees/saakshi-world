export interface Project {
  id: string
  title: string
  tagline: string
  stats: string[]
  techStack: string[]
  problem: string
  dataset: string
  approach: string
  results: string
  businessImpact: string
  githubUrl?: string
  liveUrl?: string
  isBoss?: boolean
}

export const projects: Project[] = [
  {
    id: 'chainpulse',
    title: 'ChainPulse Analytics',
    tagline: 'Something is wrong with the revenue...',
    stats: ['180K+ orders', 'XGBoost', 'Prophet', 'NLP', 'RFM'],
    techStack: ['XGBoost', 'Prophet', 'RFM', 'NLP'],
    problem: 'E-commerce businesses face three critical blind spots: Which customers are about to churn? What will revenue look like next quarter? Which customer segments deserve different treatment? Without machine learning, these questions get answered too late or with gut feeling instead of data.',
    dataset: '180,000+ order records spanning customer transactions, purchase patterns, payment behavior, and temporal trends across multiple product categories and customer segments.',
    approach: 'Built a three-part Customer Risk & Revenue Intelligence Platform: (1) Risk Prediction using XGBoost gradient boosting to classify high-risk customers based on payment patterns and order behavior, (2) Revenue Forecasting with Facebook Prophet for time-series prediction including seasonality and trend decomposition with confidence intervals, (3) Customer Segmentation via RFM (Recency, Frequency, Monetary) analysis combined with NLP-based product affinity clustering to identify distinct customer personas and cross-sell opportunities.',
    results: '[PLACEHOLDER]',
    businessImpact: '[PLACEHOLDER]',
    githubUrl: '[PLACEHOLDER]',
    liveUrl: '[PLACEHOLDER]',
    isBoss: true,
  },
  {
    id: 'the-ritual',
    title: 'The Ritual',
    tagline: 'Your skin has a story. Let\'s read it.',
    stats: ['Groq / Llama 3.3 70B', 'Supabase', 'Vercel'],
    techStack: ['Vanilla JS', 'Python serverless', 'Groq API', 'Supabase', 'Vercel'],
    problem: 'Skincare advice is either generic (blog posts that apply to everyone) or expensive (dermatologist visits). People need personalized skincare recommendations that understand their unique skin profile, seasonal changes, and product interactions — accessible and affordable.',
    dataset: 'User-submitted skin profiles (concerns, type, goals, climate), product catalog with ingredients and benefits, and community usage patterns stored in Supabase for benchmarking and similar-user analysis.',
    approach: 'Two-layer AI architecture: (1) LLM Layer — Llama 3.3 70B (via Groq) generates personalized product recommendations, creates detailed skin persona narratives, and adapts routine suggestions for seasonal changes through carefully crafted prompts that balance skin science with user context, (2) Analytics Layer — Python serverless functions compute skin health scores (0-100 scale), identify similar users via cosine similarity on concern vectors, and benchmark user profiles against community data, visualized with Chart.js interactive comparison charts.',
    results: '[PLACEHOLDER]',
    businessImpact: '[PLACEHOLDER]',
    liveUrl: 'https://the-ritual-amber.vercel.app',
    githubUrl: '[PLACEHOLDER]',
    isBoss: false,
  },
]

export function getProjectById(id: string): Project | undefined {
  return projects.find(project => project.id === id)
}
