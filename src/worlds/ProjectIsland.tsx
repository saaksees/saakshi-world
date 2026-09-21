import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { projects, getProjectById, Project } from '../data/projects'
import BossLevel from '../components/projects/BossLevel'
import QuestModal from '../components/projects/QuestModal'

function ProjectIsland() {
  const { questId } = useParams<{ questId?: string }>()
  const navigate = useNavigate()
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showListView, setShowListView] = useState(false)

  // Handle deep-link routes
  useEffect(() => {
    if (questId) {
      const project = getProjectById(questId)
      if (project) {
        setSelectedProject(project)
      }
    }
  }, [questId])

  const handleInvestigate = (project: Project) => {
    setSelectedProject(project)
    navigate(`/world/project-island/${project.id}`)
  }

  const handleCloseModal = () => {
    setSelectedProject(null)
    navigate('/world/project-island')
  }

  if (showListView) {
    return <ProjectIslandListView onBack={() => setShowListView(false)} />
  }

  const bossProject = projects.find(p => p.isBoss)
  const regularProjects = projects.filter(p => !p.isBoss)

  return (
    <div className="min-h-screen bg-navy-deep text-cream">
      {/* Header */}
      <div className="relative border-b-4 border-lavender bg-navy-panel">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="font-pixel text-3xl text-cream mb-2">Project Island</h1>
          <p className="text-lavender text-base">
            Active quests — real-world data science missions
          </p>
        </div>

        {/* Toggle View Button */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setShowListView(true)}
            className="px-4 py-2 font-sans text-sm font-medium
                       bg-transparent text-lavender border-2 border-lavender 
                       hover:bg-lavender hover:bg-opacity-10 
                       focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-electric-blue 
                       transition-all"
          >
            View as list
          </button>
        </div>
      </div>

      {/* Quest Board */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {/* Boss Level Quest */}
          {bossProject && (
            <div className="lg:col-span-2">
              <BossLevel
                project={bossProject}
                onInvestigate={() => handleInvestigate(bossProject)}
              />
            </div>
          )}

          {/* Regular Quests */}
          {regularProjects.map((project, index) => (
            <div key={project.id} className="relative group">
              {/* Apothecary glow for The Ritual */}
              <div className="relative bg-navy-panel border-4 border-lavender p-8">
                {/* Warm glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-soft via-transparent to-lavender opacity-5" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-4">
                    <span className="text-lavender font-pixel text-xs">
                      QUEST {String(index + 2).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-cream font-pixel text-xl mb-3">
                    {project.title}
                  </h3>
                  
                  <p className="text-lavender text-base italic mb-4">
                    "{project.tagline}"
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.stats.map((stat, i) => (
                      <span
                        key={i}
                        className="font-mono text-xs bg-navy-deep text-electric-blue px-3 py-1.5 border border-electric-blue"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleInvestigate(project)}
                    className="w-full px-6 py-3 font-pixel text-sm
                               bg-transparent text-lavender border-2 border-lavender
                               hover:bg-lavender hover:bg-opacity-10 hover:text-cream
                               focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-electric-blue
                               transition-all"
                  >
                    [ INVESTIGATE ]
                  </button>
                </div>

                {/* Corner accents */}
                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-pink-soft opacity-50" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-pink-soft opacity-50" />
              </div>

              {/* Subtle outer glow */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-soft to-lavender opacity-10 blur-lg
                              group-hover:opacity-20 transition-opacity" />
            </div>
          ))}
        </div>
      </div>

      {/* Quest Modal */}
      <QuestModal
        isOpen={selectedProject !== null}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </div>
  )
}

// List View Component
function ProjectIslandListView({ onBack }: { onBack: () => void }) {
  const isPlaceholder = (value: string | undefined) => {
    return value === '[PLACEHOLDER]' || !value
  }

  const renderFieldValue = (value: string | undefined, isLink = false) => {
    if (isPlaceholder(value)) {
      return (
        <dd className="text-lavender italic text-sm">
          ⚠ Quest log incomplete — this entry has not been recorded yet
        </dd>
      )
    }

    if (isLink && value) {
      return (
        <dd>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-electric-blue underline hover:text-pink-hot transition-colors"
          >
            {value}
          </a>
        </dd>
      )
    }

    return <dd className="text-cream leading-relaxed">{value}</dd>
  }

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
          ← Back to Quest Board
        </button>

        <h1 className="font-pixel text-3xl text-cream mb-2">
          Project Island
        </h1>
        
        <p className="text-lavender mb-8">
          Active quests — complete project case studies
        </p>

        <div className="space-y-12">
          {projects.map(project => (
            <article key={project.id} className="bg-navy-panel border-2 border-lavender p-6">
              <div className="mb-4">
                {project.isBoss && (
                  <span className="text-pink-hot font-pixel text-xs bg-pink-hot bg-opacity-10 px-2 py-1 border border-pink-hot inline-block mb-2">
                    ⚔ BOSS LEVEL
                  </span>
                )}
                <h2 className="font-pixel text-2xl text-cream mb-2">
                  {project.title}
                </h2>
                <p className="text-lavender italic mb-4">"{project.tagline}"</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
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

              <dl className="space-y-4">
                <div>
                  <dt className="text-electric-blue font-bold mb-1">Problem</dt>
                  {renderFieldValue(project.problem)}
                </div>

                <div>
                  <dt className="text-electric-blue font-bold mb-1">Dataset</dt>
                  {renderFieldValue(project.dataset)}
                </div>

                <div>
                  <dt className="text-electric-blue font-bold mb-1">Approach</dt>
                  {renderFieldValue(project.approach)}
                </div>

                <div>
                  <dt className="text-electric-blue font-bold mb-1">Technologies</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2 mt-2">
                      {project.techStack.map((tech, i) => (
                        <li key={i}>
                          <span className="font-mono text-xs bg-navy-deep text-pixel-gold px-3 py-1.5 border border-pixel-gold inline-block">
                            {tech}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>

                <div>
                  <dt className="text-electric-blue font-bold mb-1">Results</dt>
                  {renderFieldValue(project.results)}
                </div>

                <div>
                  <dt className="text-electric-blue font-bold mb-1">Business Impact</dt>
                  {renderFieldValue(project.businessImpact)}
                </div>

                {project.githubUrl && (
                  <div>
                    <dt className="text-electric-blue font-bold mb-1">GitHub</dt>
                    {renderFieldValue(project.githubUrl, true)}
                  </div>
                )}

                {project.liveUrl && (
                  <div>
                    <dt className="text-electric-blue font-bold mb-1">Live Demo</dt>
                    {renderFieldValue(project.liveUrl, true)}
                  </div>
                )}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectIsland
