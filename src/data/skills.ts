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
  {
    id: 'powerbi',
    worldId: 'analytics-city',
    name: 'Power BI',
    description: 'Dashboard design, DAX formulas for calculated measures, and data modeling for executive reporting.',
    tags: ['Power BI', 'DAX', 'Data Modeling'],
  },
  {
    id: 'tableau',
    worldId: 'analytics-city',
    name: 'Tableau',
    description: 'Interactive data visualization and dashboard creation for exploratory analysis and stakeholder presentations.',
    tags: ['Tableau'],
  },
  {
    id: 'business-insights',
    worldId: 'analytics-city',
    name: 'Business Insights',
    description: 'Translating data dashboards into actionable KPIs and strategic recommendations for business stakeholders.',
    tags: ['KPI Analysis', 'Business Insights'],
  },
  {
    id: 'regression',
    worldId: 'ml-lab',
    name: 'Regression',
    description: 'Building predictive models for continuous outcomes using linear and logistic regression techniques.',
    tags: ['Linear Regression', 'Logistic Regression'],
  },
  {
    id: 'classification',
    worldId: 'ml-lab',
    name: 'Classification',
    description: 'Training decision tree and ensemble models to categorize data into discrete classes.',
    tags: ['Random Forest', 'Classification'],
  },
  {
    id: 'forecasting',
    worldId: 'ml-lab',
    name: 'Forecasting',
    description: 'Time series prediction with confidence intervals using Prophet and ARIMA/SARIMAX models.',
    tags: ['Prophet', 'ARIMA/SARIMAX', 'Time Series'],
  },
  {
    id: 'xgboost',
    worldId: 'ml-lab',
    name: 'XGBoost',
    description: 'Gradient boosting framework for high-performance predictive modeling and feature importance analysis.',
    tags: ['XGBoost'],
  },
]

export function getSkillsByWorld(worldId: string): SkillNode[] {
  return skills.filter(skill => skill.worldId === worldId)
}

export function getSkillById(id: string): SkillNode | undefined {
  return skills.find(skill => skill.id === id)
}
