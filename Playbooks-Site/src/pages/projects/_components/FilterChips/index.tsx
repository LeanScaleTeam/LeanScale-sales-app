import React from 'react';
import clsx from 'clsx';
import {Tags, TagType, TagCategory, getTagsByCategory} from '@site/src/data/projects';
import {useTags, useTagCounts} from '../../_utils';
import styles from './styles.module.css';

const categoryLabels: Record<TagCategory, string> = {
  function: 'Function',
  team: 'Team',
  outcome: 'GTM Outcomes',
  metric: 'Metrics',
  complexity: 'Complexity',
};

const categoryOrder: TagCategory[] = ['function', 'outcome', 'metric', 'complexity'];

function TagChip({
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
    <button
      className={clsx(styles.chip, selected && styles.chipSelected)}
      onClick={onClick}
      style={
        {
          '--chip-color': tagData.color,
        } as React.CSSProperties
      }
      title={tagData.description}
    >
      {tagData.label}
      <span className={styles.count}>{count}</span>
    </button>
  );
}

function CategorySection({category}: {category: TagCategory}) {
  const [selectedTags, setTags] = useTags();
  const tagCounts = useTagCounts();
  const tagsInCategory = getTagsByCategory(category);

  const toggleTag = (tag: TagType) => {
    if (selectedTags.includes(tag)) {
      setTags(selectedTags.filter((t) => t !== tag));
    } else {
      setTags([...selectedTags, tag]);
    }
  };

  return (
    <div className={styles.category}>
      <span className={styles.categoryLabel}>{categoryLabels[category]}</span>
      <div className={styles.chips}>
        {tagsInCategory.map((tag) => (
          <TagChip
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

export default function FilterChips(): React.ReactNode {
  const [selectedTags, setTags] = useTags();

  return (
    <div className={styles.filterChips}>
      {categoryOrder.map((category) => (
        <CategorySection key={category} category={category} />
      ))}

      {selectedTags.length > 0 && (
        <button className={styles.clearButton} onClick={() => setTags([])}>
          Clear all filters
        </button>
      )}
    </div>
  );
}
