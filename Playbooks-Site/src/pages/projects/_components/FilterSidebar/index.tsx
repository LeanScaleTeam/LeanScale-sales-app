import React from 'react';
import {Tags, TagType, TagCategory, getTagsByCategory} from '@site/src/data/projects';
import {useTags, useTagCounts, useClearFilters} from '../../_utils';
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

  // Sort by count descending
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

export default function FilterSidebar(): React.ReactNode {
  const [selectedTags] = useTags();
  const clearFilters = useClearFilters();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3 className={styles.sidebarTitle}>Filters</h3>
        {selectedTags.length > 0 && (
          <button className={styles.clearButton} onClick={clearFilters}>
            Clear all
          </button>
        )}
      </div>
      <div className={styles.categories}>
        {categoryOrder.map((category) => (
          <CategoryGroup key={category} category={category} />
        ))}
      </div>
    </aside>
  );
}
