import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let projectsData = null;

function loadProjectsData() {
  if (!projectsData) {
    const dataPath = path.join(__dirname, '..', 'data', 'projects.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    projectsData = JSON.parse(rawData);
  }
  return projectsData;
}

function normalizeQuery(query) {
  return query.toLowerCase().trim();
}

function calculateRelevanceScore(project, query) {
  const normalizedQuery = normalizeQuery(query);
  let score = 0;
  
  // Exact name match gets highest score
  if (normalizeQuery(project.name).includes(normalizedQuery)) {
    score += 50;
  }
  
  // Description match
  if (normalizeQuery(project.description).includes(normalizedQuery)) {
    score += 30;
  }
  
  // Technology match
  const techMatch = project.technologies.some(tech => 
    normalizeQuery(tech).includes(normalizedQuery)
  );
  if (techMatch) {
    score += 40;
  }
  
  // Tag match
  const tagMatch = project.tags.some(tag => 
    normalizeQuery(tag).includes(normalizedQuery)
  );
  if (tagMatch) {
    score += 35;
  }
  
  // Category match
  if (normalizeQuery(project.category).includes(normalizedQuery)) {
    score += 25;
  }
  
  // Impact bonus
  if (project.impact === 'high') score += 5;
  
  return score;
}

export function queryProjects(query, options = {}) {
  const data = loadProjectsData();
  const { 
    limit = 10, 
    category = null, 
    status = null, 
    impact = null,
    technologies = null 
  } = options;
  
  let results = data.projects;
  
  // Apply filters
  if (category) {
    results = results.filter(p => p.category === category);
  }
  
  if (status) {
    results = results.filter(p => p.status === status);
  }
  
  if (impact) {
    results = results.filter(p => p.impact === impact);
  }
  
  if (technologies) {
    const techArray = Array.isArray(technologies) ? technologies : [technologies];
    results = results.filter(p => 
      techArray.some(tech => 
        p.technologies.some(pTech => 
          normalizeQuery(pTech).includes(normalizeQuery(tech))
        )
      )
    );
  }
  
  // Apply query search and scoring
  if (query && query.trim()) {
    results = results
      .map(project => ({
        ...project,
        relevanceScore: calculateRelevanceScore(project, query)
      }))
      .filter(project => project.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
  
  return {
    results: results.slice(0, limit),
    total: results.length,
    query: query,
    filters: { category, status, impact, technologies }
  };
}

export function getProjectById(id) {
  const data = loadProjectsData();
  return data.projects.find(p => p.id === id);
}

export function getAllProjects(options = {}) {
  const data = loadProjectsData();
  const { sortBy = 'created', order = 'desc' } = options;
  
  let projects = [...data.projects];
  
  // Sort projects
  projects.sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (order === 'desc') {
      return bVal > aVal ? 1 : -1;
    } else {
      return aVal > bVal ? 1 : -1;
    }
  });
  
  return {
    projects,
    metadata: data.metadata
  };
}

export function getProjectStats() {
  const data = loadProjectsData();
  const projects = data.projects;
  
  // Technology distribution
  const techCount = {};
  projects.forEach(p => {
    p.technologies.forEach(tech => {
      techCount[tech] = (techCount[tech] || 0) + 1;
    });
  });
  
  // Category distribution
  const categoryCount = {};
  projects.forEach(p => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });
  
  // Impact distribution
  const impactCount = {};
  projects.forEach(p => {
    impactCount[p.impact] = (impactCount[p.impact] || 0) + 1;
  });
  
  return {
    totalProjects: projects.length,
    statusDistribution: data.metadata.status_counts,
    technologyDistribution: techCount,
    categoryDistribution: categoryCount,
    impactDistribution: impactCount,
    recentProjects: projects
      .sort((a, b) => new Date(b.created) - new Date(a.created))
      .slice(0, 3)
      .map(p => ({ id: p.id, name: p.name, created: p.created })),
    lastUpdated: data.metadata.last_updated
  };
}

export function searchByTechnology(technology) {
  return queryProjects('', { technologies: technology });
}

export function getProjectsByCategory(category) {
  return queryProjects('', { category });
}

export function getProjectsByStatus(status) {
  return queryProjects('', { status });
}