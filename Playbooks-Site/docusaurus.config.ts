import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'LeanScale Playbooks',
  tagline: 'GTM execution frameworks for B2B tech startups',
  favicon: 'img/leanscale-logo.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
    experimental_faster: true, // Use Rspack/SWC for faster builds and smaller bundles
  },

  // Set the production url of your site here
  url: 'https://playbooks.leanscale.team',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        searchResultLimits: 10,
        searchBarShortcutHint: true,
        searchBarPosition: 'right',
      },
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'gtm-os',
        path: 'gtm-os',
        routeBasePath: 'gtm-os',
        sidebarPath: './sidebarsGtmOs.ts',
        editUrl: 'https://github.com/lordtoepel/Playbooks-Site/edit/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'revops-docs',
        path: 'revops-docs',
        routeBasePath: 'revops-docs',
        sidebarPath: './sidebarsRevopsDocs.ts',
        editUrl: 'https://github.com/lordtoepel/Playbooks-Site/edit/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'diagnostic',
        path: 'diagnostic',
        routeBasePath: 'diagnostic',
        sidebarPath: './sidebarsDiagnostic.ts',
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/lordtoepel/Playbooks-Site/edit/main/',
          sidebarCollapsible: true,
          sidebarCollapsed: true,
        },
        blog: false, // Blog disabled but folder preserved
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'LeanScale Playbooks',
      logo: {
        alt: 'LeanScale Logo',
        src: 'img/leanscale-logo.png',
      },
      items: [
        {
          to: '/projects',
          position: 'left',
          label: 'Browse GTM Projects',
        },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'All GTM Projects',
        },
        {
          type: 'doc',
          docId: 'intro',
          docsPluginId: 'gtm-os',
          position: 'left',
          label: 'GTM OS',
        },
        {
          type: 'doc',
          docId: 'index',
          docsPluginId: 'revops-docs',
          position: 'left',
          label: 'RevOps Docs',
        },
        {
          to: '/services-catalog',
          position: 'left',
          label: 'Catalog',
        },
        {
          type: 'doc',
          docId: 'index',
          docsPluginId: 'diagnostic',
          position: 'left',
          label: 'Diagnostic',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'LeanScale Projects',
              to: '/docs',
            },
          ],
        },
        {
          title: 'LeanScale',
          items: [
            {
              label: 'Website',
              href: 'https://leanscale.team',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} LeanScale. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
