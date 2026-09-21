import { SkillNode } from '../../data/skills'
import { terminalResponses } from '../../data/terminalResponses'

interface WorldListViewProps {
  worldName: string
  skills: SkillNode[]
  onBack: () => void
  showTerminalSamples?: boolean
}

function WorldListView({ worldName, skills, onBack, showTerminalSamples = false }: WorldListViewProps) {
  // Get sample Q&A from terminal responses (exclude fallback)
  const terminalSamples = showTerminalSamples 
    ? terminalResponses.slice(0, -1).map(r => ({
        question: r.triggerPhrases[0],
        answer: r.response
      }))
    : []

  return (
    <div className="min-h-screen bg-navy-deep text-cream font-sans p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 px-4 py-2 text-lavender border-2 border-lavender 
                     hover:bg-lavender hover:bg-opacity-10 
                     focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-electric-blue 
                     transition-all"
        >
          ← Back to Game View
        </button>

        <h1 className="font-pixel text-3xl text-cream mb-2">
          {worldName}
        </h1>
        
        <p className="text-lavender mb-8">
          Skills and technologies in this world
        </p>

        <div className="space-y-8">
          {skills.map(skill => (
            <article key={skill.id} className="bg-navy-panel border-2 border-lavender p-6">
              <h2 className="font-pixel text-xl text-cream mb-3">
                {skill.name}
              </h2>
              
              <p className="text-cream text-base leading-relaxed mb-4">
                {skill.description}
              </p>

              <div>
                <h3 className="text-lavender text-sm mb-2">Technologies:</h3>
                <ul className="flex flex-wrap gap-2" role="list">
                  {skill.tags.map(tag => (
                    <li key={tag}>
                      <span className="font-mono text-xs bg-navy-deep text-electric-blue px-3 py-1.5 border border-electric-blue inline-block">
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          {/* Terminal Sample Q&A */}
          {showTerminalSamples && terminalSamples.length > 0 && (
            <article className="bg-navy-panel border-2 border-electric-blue p-6">
              <h2 className="font-pixel text-xl text-cream mb-3">
                LLM Terminal
              </h2>
              
              <p className="text-cream text-base leading-relaxed mb-4">
                Interactive terminal for exploring projects and experience. Sample questions and answers:
              </p>

              <div className="space-y-4">
                {terminalSamples.map((qa, i) => (
                  <div key={i} className="bg-navy-deep border-l-4 border-electric-blue p-4">
                    <p className="font-mono text-sm text-pink-hot mb-2">
                      {'> '}{qa.question}
                    </p>
                    <p className="font-mono text-sm text-electric-blue leading-relaxed">
                      {qa.answer}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorldListView
