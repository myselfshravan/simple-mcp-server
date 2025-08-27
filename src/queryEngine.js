import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let projectsData = null;
let blogsData = null;

function loadProjectsData() {
  if (!projectsData) {
    const dataPath = path.join(__dirname, '..', 'data', 'projects.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    projectsData = JSON.parse(rawData);
  }
  return projectsData;
}

function loadBlogsData() {
  if (!blogsData) {
    const dataPath = path.join(__dirname, '..', 'data', 'blogs.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    blogsData = JSON.parse(rawData);
  }
  return blogsData;
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

// Blog-specific functions
function calculateBlogRelevanceScore(blog, query) {
  const normalizedQuery = normalizeQuery(query);
  let score = 0;
  
  // Title match gets highest score
  if (normalizeQuery(blog.title).includes(normalizedQuery)) {
    score += 50;
  }
  
  // Description match
  if (normalizeQuery(blog.description).includes(normalizedQuery)) {
    score += 30;
  }
  
  // URL match (for specific blog searches)
  if (normalizeQuery(blog.url).includes(normalizedQuery)) {
    score += 20;
  }
  
  return score;
}

export function queryBlogs(query, options = {}) {
  const data = loadBlogsData();
  const { limit = 10 } = options;
  
  let results = data.blogs;
  
  // Apply query search and scoring
  if (query && query.trim()) {
    results = results
      .map(blog => ({
        ...blog,
        relevanceScore: calculateBlogRelevanceScore(blog, query)
      }))
      .filter(blog => blog.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
  
  return {
    results: results.slice(0, limit),
    total: results.length,
    query: query
  };
}

export function getBlogByTitle(title) {
  const data = loadBlogsData();
  return data.blogs.find(b => 
    normalizeQuery(b.title) === normalizeQuery(title) ||
    normalizeQuery(b.title).includes(normalizeQuery(title))
  );
}

export function getBlogByUrl(url) {
  const data = loadBlogsData();
  return data.blogs.find(b => b.url === url);
}

export function getAllBlogs(options = {}) {
  const data = loadBlogsData();
  const { sortBy = 'title', order = 'asc' } = options;
  
  let blogs = [...data.blogs];
  
  // Sort blogs
  blogs.sort((a, b) => {
    const aVal = a[sortBy] || '';
    const bVal = b[sortBy] || '';
    
    if (order === 'desc') {
      return bVal > aVal ? 1 : -1;
    } else {
      return aVal > bVal ? 1 : -1;
    }
  });
  
  return {
    blogs,
    metadata: data.metadata
  };
}

export function getBlogStats() {
  const data = loadBlogsData();
  const blogs = data.blogs;
  
  // Extract topics from titles and descriptions
  const topicKeywords = {};
  blogs.forEach(blog => {
    const text = `${blog.title} ${blog.description}`.toLowerCase();
    data.metadata.topics.forEach(topic => {
      if (text.includes(topic.toLowerCase())) {
        topicKeywords[topic] = (topicKeywords[topic] || 0) + 1;
      }
    });
  });
  
  return {
    totalBlogs: blogs.length,
    topicDistribution: topicKeywords,
    recentBlogs: blogs.slice(0, 3).map(b => ({ 
      title: b.title, 
      url: b.url 
    })),
    lastUpdated: data.metadata.last_updated,
    categories: data.metadata.categories
  };
}

// Unified search functionality
export function searchAll(query, options = {}) {
  const { limit = 10 } = options;
  
  // Search projects
  const projectResults = queryProjects(query, { limit: Math.ceil(limit * 0.7) });
  
  // Search blogs  
  const blogResults = queryBlogs(query, { limit: Math.ceil(limit * 0.3) });
  
  // Combine and sort by relevance
  const allResults = [
    ...projectResults.results.map(item => ({ ...item, type: 'project' })),
    ...blogResults.results.map(item => ({ ...item, type: 'blog' }))
  ].sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  
  return {
    results: allResults.slice(0, limit),
    total: allResults.length,
    breakdown: {
      projects: projectResults.total,
      blogs: blogResults.total
    },
    query: query
  };
}