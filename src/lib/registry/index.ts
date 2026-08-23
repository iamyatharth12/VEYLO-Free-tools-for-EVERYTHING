import { CATEGORIES, ToolCategory } from './categories';
import { TOOLS_REGISTRY, ToolMetadata, ToolStatus } from './tools';

export * from './categories';
export * from './tools';

/**
 * Retrieve all registered categories, sorted by default order.
 */
export function getAllCategories(): ToolCategory[] {
  return [...CATEGORIES].sort((a, b) => a.order - b.order);
}

/**
 * Retrieve a specific category by its ID.
 */
export function getCategoryById(id: string): ToolCategory | undefined {
  return CATEGORIES.find(c => c.id === id);
}

/**
 * Retrieve all tools in the registry.
 */
export function getAllTools(): ToolMetadata[] {
  return TOOLS_REGISTRY;
}

/**
 * Retrieve only live/available tools.
 */
export function getAvailableTools(): ToolMetadata[] {
  return TOOLS_REGISTRY.filter(t => t.status === 'available');
}

/**
 * Retrieve featured tools.
 */
export function getFeaturedTools(): ToolMetadata[] {
  return TOOLS_REGISTRY.filter(t => t.featured && t.status === 'available');
}

/**
 * Retrieve popular tools.
 */
export function getPopularTools(): ToolMetadata[] {
  return TOOLS_REGISTRY.filter(t => t.popular);
}

/**
 * Retrieve tools belonging to a specific category.
 */
export function getToolsByCategory(categoryId: string, statusFilter?: ToolStatus): ToolMetadata[] {
  return TOOLS_REGISTRY.filter(t => {
    if (t.category !== categoryId) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    return true;
  });
}

/**
 * Retrieve a single tool by its route slug.
 */
export function getToolBySlug(slug: string): ToolMetadata | undefined {
  return TOOLS_REGISTRY.find(t => t.slug === slug);
}

/**
 * Retrieve related tools for a given tool slug.
 */
export function getRelatedTools(slug: string, limit = 4): ToolMetadata[] {
  const current = getToolBySlug(slug);
  if (!current) return [];

  // If explicit related tools defined:
  if (current.relatedTools && current.relatedTools.length > 0) {
    const explicit = current.relatedTools
      .map(s => getToolBySlug(s))
      .filter((t): t is ToolMetadata => t !== undefined);
    if (explicit.length >= limit) return explicit.slice(0, limit);
  }

  // Fallback to same category available tools
  const sameCategory = TOOLS_REGISTRY.filter(
    t => t.category === current.category && t.slug !== slug && t.status === 'available'
  );

  return sameCategory.slice(0, limit);
}

/**
 * Search tools across names, descriptions, keywords, and category names.
 */
export function searchTools(
  query: string,
  categoryId?: string,
  statusFilter?: ToolStatus
): ToolMetadata[] {
  const clean = query.trim().toLowerCase();

  return TOOLS_REGISTRY.filter(tool => {
    if (categoryId && categoryId !== 'all' && tool.category !== categoryId) {
      return false;
    }
    if (statusFilter && tool.status !== statusFilter) {
      return false;
    }

    if (!clean) return true;

    const nameMatch = tool.name.toLowerCase().includes(clean);
    const descMatch = tool.shortDescription.toLowerCase().includes(clean);
    const slugMatch = tool.slug.toLowerCase().includes(clean);
    const keywordMatch = tool.keywords?.some(k => k.toLowerCase().includes(clean));
    const cat = getCategoryById(tool.category);
    const catMatch = cat ? cat.name.toLowerCase().includes(clean) : false;

    return nameMatch || descMatch || slugMatch || keywordMatch || catMatch;
  });
}

/**
 * Calculate count statistics for categories and tools.
 */
export function getRegistryStats() {
  const total = TOOLS_REGISTRY.length;
  const available = TOOLS_REGISTRY.filter(t => t.status === 'available').length;
  const inDev = TOOLS_REGISTRY.filter(t => t.status === 'coming-soon').length;
  const categoriesCount = CATEGORIES.length;

  return {
    total,
    available,
    inDev,
    categoriesCount,
  };
}
