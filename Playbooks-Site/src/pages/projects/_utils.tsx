import {useMemo, useState, useCallback, useEffect, createContext, useContext, ReactNode} from 'react';
import {sortedProjects, TagType, Project, Tags, TagCategory, getTagsByCategory} from '@site/src/data/projects';

// ============ SHARED FILTER CONTEXT ============
// This ensures all components share the same filter state

type FilterContextType = {
  tags: TagType[];
  setTags: (tags: TagType[]) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  mobileDrawerOpen: boolean;
  toggleMobileDrawer: () => void;
  closeMobileDrawer: () => void;
};

const FilterContext = createContext<FilterContextType | null>(null);

function getInitialTags(): TagType[] {
  if (typeof window === 'undefined') return [];
  const params = new URLSearchParams(window.location.search);
  return params.getAll('tags') as TagType[];
}

function getInitialSearch(): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return params.get('q') || '';
}

function updateUrl(tags: TagType[], searchQuery: string) {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams();
  tags.forEach(t => params.append('tags', t));
  if (searchQuery) params.set('q', searchQuery);

  const newUrl = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  window.history.replaceState(null, '', newUrl);
}

export function FilterProvider({children}: {children: ReactNode}) {
  const [tags, setTagsState] = useState<TagType[]>(getInitialTags);
  const [searchQuery, setSearchQueryState] = useState<string>(getInitialSearch);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const setTags = useCallback((newTags: TagType[]) => {
    setTagsState(newTags);
    updateUrl(newTags, searchQuery);
  }, [searchQuery]);

  const setSearchQuery = useCallback((newQuery: string) => {
    setSearchQueryState(newQuery);
    updateUrl(tags, newQuery);
  }, [tags]);

  const toggleMobileDrawer = useCallback(() => {
    setMobileDrawerOpen(prev => !prev);
  }, []);

  const closeMobileDrawer = useCallback(() => {
    setMobileDrawerOpen(false);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  return (
    <FilterContext.Provider value={{
      tags, setTags,
      searchQuery, setSearchQuery,
      mobileDrawerOpen, toggleMobileDrawer, closeMobileDrawer
    }}>
      {children}
    </FilterContext.Provider>
  );
}

function useFilterContext(): FilterContextType {
  const context = useContext(FilterContext);
  if (!context) {
    // Fallback for components outside provider (shouldn't happen)
    return {
      tags: [],
      setTags: () => {},
      searchQuery: '',
      setSearchQuery: () => {},
      mobileDrawerOpen: false,
      toggleMobileDrawer: () => {},
      closeMobileDrawer: () => {},
    };
  }
  return context;
}

// Hook for mobile drawer
export function useMobileDrawer() {
  const {mobileDrawerOpen, toggleMobileDrawer, closeMobileDrawer} = useFilterContext();
  return {isOpen: mobileDrawerOpen, toggle: toggleMobileDrawer, close: closeMobileDrawer};
}

// Hook for managing selected tags
export function useTags(): [TagType[], (tags: TagType[]) => void] {
  const {tags, setTags} = useFilterContext();
  return [tags, setTags];
}

// Hook for search query
export function useSearchQuery(): [string, (q: string) => void] {
  const {searchQuery, setSearchQuery} = useFilterContext();
  return [searchQuery, setSearchQuery];
}

// Filter projects based on tags and search
function filterProjects({
  projects,
  tags,
  searchQuery,
}: {
  projects: Project[];
  tags: TagType[];
  searchQuery: string;
}): Project[] {
  let filtered = projects;

  // Filter by tags (OR logic - has any selected tag)
  if (tags.length > 0) {
    filtered = filtered.filter((project) =>
      tags.some((tag) => project.tags.includes(tag))
    );
  }

  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (project) =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query)
    );
  }

  return filtered;
}

// Main hook for getting filtered projects
export function useFilteredProjects(): Project[] {
  const [tags] = useTags();
  const [searchQuery] = useSearchQuery();

  return useMemo(
    () => filterProjects({projects: sortedProjects, tags, searchQuery}),
    [tags, searchQuery]
  );
}

// Hook for toggling a single tag
export function useTagToggle(tag: TagType): [boolean, () => void] {
  const [tags, setTags] = useTags();
  const isSelected = tags.includes(tag);

  const toggle = useCallback(() => {
    if (isSelected) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  }, [tag, tags, setTags, isSelected]);

  return [isSelected, toggle];
}

// Clear all filters
export function useClearFilters(): () => void {
  const [, setTags] = useTags();
  const [, setSearch] = useSearchQuery();

  return useCallback(() => {
    setTags([]);
    setSearch('');
  }, [setTags, setSearch]);
}

// Get count of projects per tag
export function useTagCounts(): Record<TagType, number> {
  return useMemo(() => {
    const counts: Partial<Record<TagType, number>> = {};
    for (const project of sortedProjects) {
      for (const tag of project.tags) {
        counts[tag] = (counts[tag] || 0) + 1;
      }
    }
    return counts as Record<TagType, number>;
  }, []);
}
