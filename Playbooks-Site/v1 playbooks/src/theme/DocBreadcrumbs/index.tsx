import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useSidebarBreadcrumbs} from '@docusaurus/plugin-content-docs/client';
import {useHomePageRoute} from '@docusaurus/theme-common/internal';
import {useLocation} from '@docusaurus/router';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import HomeBreadcrumbItem from '@theme/DocBreadcrumbs/Items/Home';
import DocBreadcrumbsStructuredData from '@theme/DocBreadcrumbs/StructuredData';

import styles from './styles.module.css';

// Multi-page playbook configurations
const PLAYBOOK_NAV = {
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

function PlaybookStepper({basePath, config, currentSlug}: {
  basePath: string;
  config: typeof PLAYBOOK_NAV[keyof typeof PLAYBOOK_NAV];
  currentSlug: string | null;
}): ReactNode {
  const currentIndex = config.pages.findIndex(p => p.slug === currentSlug);

  return (
    <div className={styles.playbookWrapper}>
      <Link to="/projects" className={styles.backLink}>
        ← Browse GTM Projects
      </Link>
      <div className={styles.playbookNav}>
        <div className={styles.playbookHeader}>
          <span className={styles.playbookTitle}>{config.title}</span>
          {currentIndex >= 0 && (
            <span className={styles.pageCount}>{currentIndex + 1} of {config.pages.length}</span>
          )}
        </div>
        <div className={styles.stepper}>
          {config.pages.map((page, idx) => {
            const isCurrent = page.slug === currentSlug;
            const isPast = currentIndex > idx;
            return (
              <React.Fragment key={page.slug}>
                {idx > 0 && <span className={styles.stepConnector}>―</span>}
                <Link
                  to={`/docs/${basePath}/${page.slug}`}
                  className={clsx(styles.step, {
                    [styles.stepCurrent]: isCurrent,
                    [styles.stepPast]: isPast,
                  })}
                >
                  <span className={styles.stepDot}>{isCurrent ? '●' : isPast ? '●' : '○'}</span>
                  <span className={styles.stepLabel}>{page.label}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getPlaybookInfo(pathname: string) {
  for (const [basePath, config] of Object.entries(PLAYBOOK_NAV)) {
    if (pathname.includes(basePath)) {
      // Extract current slug using the folder name from config
      const parts = pathname.split('/');
      const folderIndex = parts.findIndex(p => p === config.folderName);
      const currentSlug = folderIndex !== -1 ? parts[folderIndex + 1] : null;
      return {basePath, config, currentSlug};
    }
  }
  return null;
}

// TODO move to design system folder
function BreadcrumbsItemLink({
  children,
  href,
  isLast,
}: {
  children: ReactNode;
  href: string | undefined;
  isLast: boolean;
}): ReactNode {
  const className = 'breadcrumbs__link';
  if (isLast) {
    return <span className={className}>{children}</span>;
  }
  return href ? (
    <Link className={className} href={href}>
      <span>{children}</span>
    </Link>
  ) : (
    <span className={className}>{children}</span>
  );
}

// TODO move to design system folder
function BreadcrumbsItem({
  children,
  active,
}: {
  children: ReactNode;
  active?: boolean;
}): ReactNode {
  return (
    <li
      className={clsx('breadcrumbs__item', {
        'breadcrumbs__item--active': active,
      })}>
      {children}
    </li>
  );
}

export default function DocBreadcrumbs(): ReactNode {
  const breadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();
  const location = useLocation();

  const playbookInfo = getPlaybookInfo(location.pathname);

  if (!breadcrumbs) {
    return null;
  }

  // For in-depth playbooks, show custom stepper nav
  if (playbookInfo) {
    return (
      <>
        <DocBreadcrumbsStructuredData breadcrumbs={breadcrumbs} />
        <PlaybookStepper
          basePath={playbookInfo.basePath}
          config={playbookInfo.config}
          currentSlug={playbookInfo.currentSlug}
        />
      </>
    );
  }

  // Default breadcrumbs for other pages
  return (
    <>
      <DocBreadcrumbsStructuredData breadcrumbs={breadcrumbs} />
      <div className={styles.breadcrumbRow}>
        <nav
          className={clsx(
            ThemeClassNames.docs.docBreadcrumbs,
            styles.breadcrumbsContainer,
          )}
          aria-label={translate({
            id: 'theme.docs.breadcrumbs.navAriaLabel',
            message: 'Breadcrumbs',
            description: 'The ARIA label for the breadcrumbs',
          })}>
          <ul className="breadcrumbs">
            {homePageRoute && <HomeBreadcrumbItem />}
            {breadcrumbs.map((item, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              const href =
                item.type === 'category' && item.linkUnlisted
                  ? undefined
                  : item.href;
              return (
                <BreadcrumbsItem key={idx} active={isLast}>
                  <BreadcrumbsItemLink href={href} isLast={isLast}>
                    {item.label}
                  </BreadcrumbsItemLink>
                </BreadcrumbsItem>
              );
            })}
          </ul>
        </nav>
        <Link to="/projects" className={styles.browseLink}>
          ← Browse GTM Projects
        </Link>
      </div>
    </>
  );
}
