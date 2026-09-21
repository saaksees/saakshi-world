import { Project } from '../../data/projects'
import Modal from '../ui/Modal'

interface QuestModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
}

function QuestModal({ isOpen, onClose, project }: QuestModalProps) {
  if (!project) return null

  const isPlaceholder = (value: string | undefined) => {
    return value === '[PLACEHOLDER]' || !value
  }

  const renderField = (label: string, content: string | undefined, isLink = false) => {
    if (isPlaceholder(content)) {
      return (
        <div className="mb-6">
          <h3 className="text-electric-blue font-pixel text-sm mb-2">{label}</h3>
          <div className="border-2 border-dashed border-navy-panel bg-navy-deep bg-opacity-50 p-4 rounded">
            <p className="text-lavender text-sm italic flex items-center gap-2">
              <span className="text-pixel-gold">⚠</span>
              Quest log incomplete — this entry has not been recorded yet
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="mb-6">
        <h3 className="text-electric-blue font-pixel text-sm mb-2">{label}</h3>
        {isLink ? (
          <a
            href={content}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 bg-electric-blue text-navy-deep font-sans text-sm font-medium
                       hover:bg-opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-hot
                       transition-all"
          >
            {label === 'Live Demo' ? '→ Visit Live Demo' : '→ View on GitHub'}
          </a>
        ) : (
          <p className="text-cream font-sans text-base leading-relaxed">{content}</p>
        )}
      </div>
    )
  }

  // Boss level sub-panels for ChainPulse
  const renderBossSubPanels = () => {
    if (!project.isBoss) return null

    const panels = [
      {
        title: 'Risk Prediction',
        content: 'XGBoost gradient boosting classifies high-risk customers based on payment patterns and order behavior, enabling proactive intervention before churn occurs.',
      },
      {
        title: 'Revenue Forecasting',
        content: 'Facebook Prophet handles time-series prediction with seasonality decomposition and trend analysis, providing confidence intervals for quarterly revenue projections.',
      },
      {
        title: 'Customer Segmentation',
        content: 'RFM analysis combined with NLP-based product affinity clustering identifies distinct customer personas and cross-sell opportunities across 180K+ orders.',
      },
    ]

    return (
      <div className="mb-6">
        <h3 className="text-pink-hot font-pixel text-sm mb-3">⚔ BOSS COMPONENTS</h3>
        <div className="space-y-3">
          {panels.map((panel, i) => (
            <div
              key={i}
              className="bg-navy-panel border-l-4 border-pink-hot p-4"
            >
              <h4 className="text-electric-blue font-sans text-sm font-bold mb-2">
                {i + 1}. {panel.title}
              </h4>
              <p className="text-cream font-sans text-sm leading-relaxed">
                {panel.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            {project.isBoss && (
              <span className="text-pink-hot font-pixel text-xs bg-pink-hot bg-opacity-10 px-2 py-1 border border-pink-hot">
                BOSS LEVEL
              </span>
            )}
            <h2 className="text-cream font-pixel text-2xl">{project.title}</h2>
          </div>
          <p className="text-lavender text-base italic mb-4">"{project.tagline}"</p>
          
          <div className="flex flex-wrap gap-2">
            {project.stats.map((stat, i) => (
              <span
                key={i}
                className="font-mono text-xs bg-navy-deep text-electric-blue px-3 py-1.5 border border-electric-blue"
              >
                {stat}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t-2 border-navy-panel pt-6">
          {renderField('Problem', project.problem)}
          {renderField('Dataset', project.dataset)}
          {renderField('Approach', project.approach)}
          
          {renderBossSubPanels()}

          <div className="mb-6">
            <h3 className="text-electric-blue font-pixel text-sm mb-2">Technologies</h3>
            <ul className="flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <li key={i}>
                  <span className="font-mono text-xs bg-navy-panel text-pixel-gold px-3 py-1.5 border border-pixel-gold inline-block">
                    {tech}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {renderField('Results', project.results)}
          {renderField('Business Impact', project.businessImpact)}
          
          {project.githubUrl && renderField('GitHub', project.githubUrl, true)}
          {project.liveUrl && renderField('Live Demo', project.liveUrl, true)}
        </div>
      </div>
    </Modal>
  )
}

export default QuestModal
