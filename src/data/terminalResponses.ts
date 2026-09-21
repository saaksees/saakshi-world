export interface TerminalResponse {
  triggerPhrases: string[] // lowercase keywords to match
  response: string
}

export const terminalResponses: TerminalResponse[] = [
  {
    triggerPhrases: ['work on', 'what does she do', 'role', 'job'],
    response: 'Data Analyst with ML/AI focus — building predictive models, designing dashboards, and translating data into strategic insights for business stakeholders.',
  },
  {
    triggerPhrases: ['chainpulse'],
    response: 'ChainPulse Analytics: Customer Risk & Revenue Intelligence Platform. Processed 180K+ orders using XGBoost for churn prediction, Prophet for revenue forecasting, RFM segmentation, and NLP for customer feedback analysis.',
  },
  {
    triggerPhrases: ['ritual', 'skincare'],
    response: 'The Ritual: AI-powered skincare recommendation system built with Groq and Llama 3.3 70B. Analyzes skin concerns and provides personalized product suggestions with detailed explanations.',
  },
  {
    triggerPhrases: ['technolog', 'stack', 'tools', 'tech'],
    response: 'Core Stack: Python (Pandas, NumPy, Scikit-learn), SQL/SQL Server, Power BI, Tableau, XGBoost, Prophet, TensorFlow/Keras, NLP libraries, Git. Recently: Groq, Llama models, React/TypeScript.',
  },
  {
    triggerPhrases: [], // fallback - empty triggers means this catches unmatched input
    response: 'I don\'t have an answer for that yet — try asking about her projects, tech stack, or what she works on.',
  },
]

/**
 * Match user input against terminal responses
 * Returns the first matching response or fallback
 * Designed to be easily replaced with an API call in the future
 */
export function getTerminalResponse(input: string): string {
  const normalizedInput = input.toLowerCase().trim()
  
  if (!normalizedInput) {
    return terminalResponses[terminalResponses.length - 1].response // fallback for empty input
  }
  
  // Check each response's trigger phrases
  for (const responseEntry of terminalResponses) {
    // Skip fallback (empty triggerPhrases) for now
    if (responseEntry.triggerPhrases.length === 0) continue
    
    // Check if any trigger phrase is contained in the input
    for (const trigger of responseEntry.triggerPhrases) {
      if (normalizedInput.includes(trigger)) {
        return responseEntry.response
      }
    }
  }
  
  // No match found, return fallback
  return terminalResponses[terminalResponses.length - 1].response
}

/**
 * Future API integration point:
 * Replace getTerminalResponse with:
 * 
 * export async function getTerminalResponse(input: string): Promise<string> {
 *   const response = await fetch('/api/terminal', {
 *     method: 'POST',
 *     body: JSON.stringify({ query: input })
 *   })
 *   const data = await response.json()
 *   return data.response
 * }
 */
