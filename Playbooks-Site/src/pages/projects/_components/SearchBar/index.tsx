import React, {useState, useEffect} from 'react';
import {useSearchQuery} from '../../_utils';
import styles from './styles.module.css';

export default function SearchBar(): React.ReactNode {
  const [query, setQuery] = useSearchQuery();
  const [inputValue, setInputValue] = useState(query);

  // Sync input with URL on mount
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Debounce search updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(inputValue);
    }, 200);
    return () => clearTimeout(timer);
  }, [inputValue, setQuery]);

  return (
    <div className={styles.searchBar}>
      <svg
        className={styles.searchIcon}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        placeholder="Search projects..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={styles.input}
      />
      {inputValue && (
        <button
          className={styles.clearButton}
          onClick={() => setInputValue('')}
          aria-label="Clear search"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
