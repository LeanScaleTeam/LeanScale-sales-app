import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {Project, Tags, TagType} from '@site/src/data/projects';
import styles from './styles.module.css';

function ProjectTags({tags}: {tags: TagType[]}) {
  // Show max 4 tags
  const displayTags = tags.slice(0, 4);
  const remaining = tags.length - 4;

  return (
    <div className={styles.tags}>
      {displayTags.map((tag) => (
        <span
          key={tag}
          className={styles.tag}
          style={{backgroundColor: Tags[tag].color}}
        >
          {Tags[tag].label}
        </span>
      ))}
      {remaining > 0 && <span className={styles.tagMore}>+{remaining}</span>}
    </div>
  );
}

function ProjectCard({project}: {project: Project}): React.ReactNode {
  return (
    <Link to={project.docPath} className={styles.cardLink}>
      <div className={clsx('card', styles.projectCard)}>
        <div className="card__header">
          <h3 className={styles.title}>{project.title}</h3>
          {project.featured && (
            <span className={styles.featuredBadge}>Featured</span>
          )}
        </div>
        <div className="card__body">
          <p className={styles.description}>{project.description}</p>
        </div>
        <div className="card__footer">
          <ProjectTags tags={project.tags} />
        </div>
      </div>
    </Link>
  );
}

export default React.memo(ProjectCard);
