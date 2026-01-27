import React, {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';

// Scroll active sidebar item into view on page load
// Only targets the LEFT sidebar menu container, not the right TOC
function useScrollToActiveSidebarItem() {
  const location = useLocation();

  useEffect(() => {
    // Small delay to let Docusaurus render the sidebar
    const timer = setTimeout(() => {
      // Target the scrollable menu container inside the left sidebar
      const menuContainer = document.querySelector('.theme-doc-sidebar-container .menu');
      if (menuContainer) {
        const activeItem = menuContainer.querySelector('.menu__link--active');
        if (activeItem) {
          // Calculate position relative to the menu container and scroll it directly
          const containerRect = menuContainer.getBoundingClientRect();
          const itemRect = activeItem.getBoundingClientRect();
          const scrollTop = menuContainer.scrollTop + (itemRect.top - containerRect.top) - (containerRect.height / 2);

          menuContainer.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);
}

export default function Root({children}) {
  useScrollToActiveSidebarItem();
  return <>{children}</>;
}
