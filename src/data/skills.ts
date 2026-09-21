export interface SkillNode {
  id: string
  worldId: string
  name: string
  description: string
  tags: string[]
}

export const skills: SkillNode[] = [
  {
    id: 'python',
    worldId: 'data-valley',
    name: 'Python',
    description: 'Used for data cleaning, analysis, visualization, and machine learning.',
    tags: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn'],
  },
  {
    id: 'sql',
    worldId: 'data-valley',
    name: 'SQL',
    description: 'Daily query writing for data extraction, joins, aggregations, and database management.',
    tags: ['SQL', 'SQL Server'],
  },
  {
    id: 'statistics',
    worldId: 'data-valley',
    name: 'Statistics',
    description: 'Applied statistical methods for hypothesis testing, modeling, and data interpretation.',
    tags: ['Statistics'],
  },
]

export function getSkillsByWorld(worldId: string): SkillNode[] {
  return skills.filter(skill => skill.worldId === worldId)
}

export function getSkillById(id: string): SkillNode | undefined {
  return skills.find(skill => skill.id === id)
}
