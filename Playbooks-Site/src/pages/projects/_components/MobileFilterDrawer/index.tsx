import React from 'react';
import {Tags, TagType, TagCategory, getTagsByCategory} from '@site/src/data/projects';
import {useTags, useTagCounts, useClearFilters, useMobileDrawer} from '../../_utils';
import styles from './styles.module.css';

const categoryLabels: Record<TagCategory, string> = {
  function: 'Function',
  team: 'Team',
  outcome: 'GTM Outcomes',
  metric: 'B2B Metrics',
  complexity: 'Complexity',
};

const categoryOrder: TagCategory[] = ['function', 'outcome', 'metric', 'team', 'complexity'];

function CheckboxItem({
  tag,
  selected,
  count,
  onClick,
}: {
  tag: TagType;
  selected: boolean;
  count: number;
  onClick: () => void;
}) {
  const tagData = Tags[tag];
  return (
    <label className={styles.checkboxItem}>
      <input
        type="checkbox"
        checked={selected}
        onChange={onClick}
        className={styles.checkbox}
      />
      <span className={styles.label}>{tagData.label}</span>
      <span className={styles.count}>{count}</span>
    </label>
  );
}

function CategoryGroup({category}: {category: TagCategory}) {
  const [selectedTags, setTags] = useTags();
  const tagCounts = useTagCounts();
  const tagsInCategory = getTagsByCategory(category);

  const sortedTags = [...tagsInCategory].sort(
    (a, b) => (tagCounts[b] || 0) - (tagCounts[a] || 0)
  );

  const toggleTag = (tag: TagType) => {
    if (selectedTags.includes(tag)) {
      setTags(selectedTags.filter((t) => t !== tag));
    } else {
      setTags([...selectedTags, tag]);
    }
  };

  const selectedInCategory = sortedTags.filter((t) => selectedTags.includes(t)).length;

  return (
    <div className={styles.categoryGroup}>
      <div className={styles.categoryHeader}>
        <span className={styles.categoryTitle}>
          {categoryLabels[category]}
          {selectedInCategory > 0 && (
            <span className={styles.selectedBadge}>{selectedInCategory}</span>
          )}
        </span>
      </div>
      <div className={styles.checkboxList}>
        {sortedTags.map((tag) => (
          <CheckboxItem
            key={tag}
            tag={tag}
            selected={selectedTags.includes(tag)}
            count={tagCounts[tag] || 0}
            onClick={() => toggleTag(tag)}
          />
        ))}
      </div>
    </div>
  );
}

export default function MobileFilterDrawer(): React.ReactNode {
  const [selectedTags] = useTags();
  const clearFilters = useClearFilters();
  const {isOpen, close} = useMobileDrawer();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ''}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>Filters</h3>
          <button
            className={styles.closeButton}
            onClick={close}
            aria-label="Close filters"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {selectedTags.length > 0 && (
          <button className={styles.clearButton} onClick={clearFilters}>
            Clear all filters
          </button>
        )}

        <div className={styles.categories}>
          {categoryOrder.map((category) => (
            <CategoryGroup key={category} category={category} />
          ))}
        </div>
      </aside>
    </>
  );
}
