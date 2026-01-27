import React from 'react';
import {useFilteredProjects} from '../../_utils';
import ProjectCard from '../ProjectCard';
import styles from './styles.module.css';

function NoResults() {
  return (
    <div className={styles.noResults}>
      <h3>No projects found</h3>
      <p>Try adjusting your filters or search query.</p>
    </div>
  );
}

export default function ProjectGrid(): React.ReactNode {
  const filteredProjects = useFilteredProjects();

  if (filteredProjects.length === 0) {
    return <NoResults />;
  }

  return (
    <section className={styles.grid}>
      {filteredProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  );
}
