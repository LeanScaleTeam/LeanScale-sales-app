import React from 'react';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './SiblingNav.module.css';

// Define the multi-page playbook structures
const PLAYBOOK_SIBLINGS = {
  'in-depth/market-map': {
    title: 'Market Map',
    folderName: 'market-map',
    pages: [
      {slug: 'overview', label: 'Overview'},
      {slug: 'methodology', label: 'Methodology'},
      {slug: 'implementation', label: 'Implementation'},
      {slug: 'support', label: 'Post Support'},
    ],
  },
  'in-depth/attribution': {
    title: 'Attribution',
    folderName: 'attribution',
    pages: [
      {slug: 'overview', label: 'Overview'},
      {slug: 'methodology', label: 'Methodology'},
      {slug: 'implementation', label: 'Implementation'},
      {slug: 'support', label: 'Post Support'},
    ],
  },
  'in-depth/automated-inbound': {
    title: 'Automated Inbound',
    folderName: 'automated-inbound',
    pages: [
      {slug: 'overview', label: 'Overview'},
      {slug: 'methodology', label: 'Methodology'},
      {slug: 'implementation', label: 'Implementation'},
      {slug: 'support', label: 'Post Support'},
    ],
  },
  'in-depth/growth-model': {
    title: 'Growth Model',
    folderName: 'growth-model',
    pages: [
      {slug: 'overview', label: 'Overview'},
      {slug: 'methodology', label: 'Methodology'},
      {slug: 'implementation', label: 'Implementation'},
      {slug: 'support', label: 'Post Support'},
    ],
  },
};

function findCurrentPlaybook(pathname: string) {
  for (const [basePath, config] of Object.entries(PLAYBOOK_SIBLINGS)) {
    if (pathname.includes(basePath)) {
      return {basePath, config};
    }
  }
  return null;
}

function getCurrentSlug(pathname: string, basePath: string, folderName: string): string | null {
  // Extract the current page slug from the pathname
  // e.g., /docs/in-depth/market-map/methodology -> methodology
  const parts = pathname.split('/');
  const baseIndex = parts.findIndex((p) => p === folderName);
  if (baseIndex !== -1 && parts[baseIndex + 1]) {
    return parts[baseIndex + 1];
  }
  // Check if we're on the index page
  if (pathname.endsWith(basePath) || pathname.endsWith(basePath + '/')) {
    return 'index';
  }
  return null;
}

export default function SiblingNav(): React.ReactNode {
  const location = useLocation();
  const playbook = findCurrentPlaybook(location.pathname);

  if (!playbook) return null;

  const {basePath, config} = playbook;
  const currentSlug = getCurrentSlug(location.pathname, basePath, config.folderName);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>📘</span>
        <span className={styles.title}>{config.title}</span>
      </div>
      <ul className={styles.list}>
        {config.pages.map((page) => {
          const isCurrent = currentSlug === page.slug;
          return (
            <li key={page.slug} className={styles.item}>
              <Link
                to={`/docs/${basePath}/${page.slug}`}
                className={`${styles.link} ${isCurrent ? styles.current : ''}`}
              >
                <span className={styles.indicator}>
                  {isCurrent ? '●' : '○'}
                </span>
                {page.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
