import Modal from '../ui/Modal'
import { SkillNode } from '../../data/skills'

interface InteractionModalProps {
  isOpen: boolean
  onClose: () => void
  skill: SkillNode | null
  dashboardPreview?: React.ReactNode
}

function InteractionModal({ isOpen, onClose, skill, dashboardPreview }: InteractionModalProps) {
  if (!skill) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={skill.name}>
      <div className="space-y-4">
        <p className="text-cream text-base leading-relaxed">
          {skill.description}
        </p>

        {dashboardPreview && (
          <div className="my-6">
            {dashboardPreview}
          </div>
        )}
        
        <div>
          <p className="text-lavender text-sm mb-2">Technologies:</p>
          <div className="flex flex-wrap gap-2">
            {skill.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-xs bg-navy-deep text-electric-blue px-3 py-1.5 border border-electric-blue"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Placeholder notice for future content */}
        <div className="mt-4 p-3 bg-navy-deep border-l-4 border-pink-soft">
          <p className="text-pink-soft text-xs font-mono">
            [PLACEHOLDER] Detailed project examples and business impact metrics coming soon
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default InteractionModal
