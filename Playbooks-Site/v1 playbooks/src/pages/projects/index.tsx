import React from 'react';
import Layout from '@theme/Layout';
import {useFilteredProjects, FilterProvider} from './_utils';
import FilterSidebar from './_components/FilterSidebar';
import ProjectGrid from './_components/ProjectGrid';
import SearchBar from './_components/SearchBar';
import MobileFilterDrawer from './_components/MobileFilterDrawer';
import MobileFilterToggle from './_components/MobileFilterToggle';
import styles from './index.module.css';

function ResultCount() {
  const filteredProjects = useFilteredProjects();
  return (
    <div className={styles.resultCount}>
      Showing <strong>{filteredProjects.length}</strong> of 68 projects
    </div>
  );
}

export default function ProjectsPage(): React.ReactNode {
  return (
    <Layout
      title="Projects"
      description="Browse 68 GTM execution playbooks by function, team, outcome, or metric"
    >
      <FilterProvider>
        <MobileFilterDrawer />
        <div className={styles.pageWrapper}>
          <FilterSidebar />
          <main className={styles.main}>
            <div className={styles.contentHeader}>
              <MobileFilterToggle />
              <SearchBar />
              <p className={styles.intro}>
                Step-by-step execution frameworks for B2B GTM teams. Each playbook includes objectives, prerequisites, implementation steps, and success metrics.
              </p>
              <ResultCount />
            </div>
            <ProjectGrid />
          </main>
        </div>
      </FilterProvider>
    </Layout>
  );
}
