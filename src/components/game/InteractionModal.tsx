import Modal from '../ui/Modal'
import { SkillNode } from '../../data/skills'

interface InteractionModalProps {
  isOpen: boolean
  onClose: () => void
  skill: SkillNode | null
}

function InteractionModal({ isOpen, onClose, skill }: InteractionModalProps) {
  if (!skill) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={skill.name}>
      <div className="space-y-4">
        <p className="text-cream text-base leading-relaxed">
          {skill.description}
        </p>
        
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
      </div>
    </Modal>
  )
}

export default InteractionModal
