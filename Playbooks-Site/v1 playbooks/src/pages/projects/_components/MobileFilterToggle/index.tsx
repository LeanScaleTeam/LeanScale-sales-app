import React from 'react';
import {useMobileDrawer, useTags} from '../../_utils';
import styles from './styles.module.css';

export default function MobileFilterToggle(): React.ReactNode {
  const {toggle} = useMobileDrawer();
  const [selectedTags] = useTags();

  return (
    <button className={styles.toggle} onClick={toggle} aria-label="Open filters">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
      <span>Filters</span>
      {selectedTags.length > 0 && (
        <span className={styles.badge}>{selectedTags.length}</span>
      )}
    </button>
  );
}
