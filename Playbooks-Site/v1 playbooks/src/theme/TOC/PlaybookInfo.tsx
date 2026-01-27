import React, {useEffect, useRef} from 'react';
import {useLocation} from '@docusaurus/router';
import {Projects, Tags, TagType} from '@site/src/data/projects';
import styles from './PlaybookInfo.module.css';

function useCurrentProject() {
  const location = useLocation();
  const path = location.pathname;
  return Projects.find((p) => path.includes(p.docPath.replace('/docs/', '')));
}

function groupTagsByCategory(tags: TagType[]) {
  const groups: Record<string, TagType[]> = {
    complexity: [],
    function: [],
    team: [],
    outcome: [],
    metric: [],
  };
  tags.forEach((tag) => {
    const category = Tags[tag]?.category;
    if (category && groups[category]) {
      groups[category].push(tag);
    }
  });
  return groups;
}

function TagBadge({tag}: {tag: TagType}) {
  const tagInfo = Tags[tag];
  if (!tagInfo) return null;
  return (
    <span className={styles.tag} style={{backgroundColor: tagInfo.color}}>
      {tagInfo.label}
    </span>
  );
}

const categoryLabels: Record<string, string> = {
  complexity: 'Complexity',
  function: 'Function',
  team: 'Team',
  outcome: 'Outcomes',
  metric: 'Metrics',
};

export default function PlaybookInfo(): React.ReactNode {
  const project = useCurrentProject();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !project) return;
    const h1 = document.querySelector('.markdown h1');
    if (h1 && cardRef.current) {
      h1.insertAdjacentElement('afterend', cardRef.current);
    }
  }, [project]);

  if (!project) return null;

  const tagGroups = groupTagsByCategory(project.tags);

  return (
    <div ref={cardRef} className={styles.card}>
      <div className={styles.tagsRow}>
        {Object.entries(tagGroups).map(([category, tags]) => {
          if (tags.length === 0) return null;
          return (
            <div key={category} className={styles.categoryGroup}>
              <span className={styles.label}>{categoryLabels[category]}</span>
              <div className={styles.tags}>
                {tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
