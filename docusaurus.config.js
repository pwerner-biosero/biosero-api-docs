// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Biosero Data Services API Documentation',
  tagline: '',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://pwerner-biosero.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/biosero-api-docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'biosero', // Usually your GitHub org/user name.
  projectName: 'biosero-api-docs', // Usually your repo name.
  deploymentBranch: 'master',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false, // Disable the default docs plugin
        blog: false, // Disable the blog
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'csharp-sdk',
        path: 'docs/CSharp SDK',
        routeBasePath: 'csharp-sdk',
        sidebarPath: './sidebars-csharp.js',
        editUrl:
          'https://github.com/pwerner-biosero/biosero-api-docs/edit/master/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'python-sdk',
        path: 'docs/Python SDK',
        routeBasePath: 'python-sdk',
        sidebarPath: './sidebars-python.js',
        editUrl:
          'https://github.com/pwerner-biosero/biosero-api-docs/edit/master/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'data-services',
        path: 'docs/Orchestrator/Data Services',
        routeBasePath: 'orchestrator/data-services',
        sidebarPath: './sidebars-data-services.js',
        editUrl:
          'https://github.com/pwerner-biosero/biosero-api-docs/edit/master/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'conductor',
        path: 'docs/Orchestrator/Conductor',
        routeBasePath: 'orchestrator/conductor',
        sidebarPath: './sidebars-conductor.js',
        editUrl:
          'https://github.com/pwerner-biosero/biosero-api-docs/edit/master/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'designer',
        path: 'docs/Orchestrator/Designer',
        routeBasePath: 'orchestrator/designer',
        sidebarPath: './sidebars-designer.js',
        editUrl:
          'https://github.com/pwerner-biosero/biosero-api-docs/edit/master/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'scheduler',
        path: 'docs/Orchestrator/Scheduler',
        routeBasePath: 'orchestrator/scheduler',
        sidebarPath: './sidebars-scheduler.js',
        editUrl:
          'https://github.com/pwerner-biosero/biosero-api-docs/edit/master/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'execution-agents',
        path: 'docs/Orchestrator/Execution Agents',
        routeBasePath: 'orchestrator/execution-agents',
        sidebarPath: './sidebars-execution-agents.js',
        editUrl:
          'https://github.com/pwerner-biosero/biosero-api-docs/edit/master/',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-card.jpeg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        logo: {
          alt: 'Biosero Logo',
          src: 'img/logo-dark.png',
          srcDark: 'img/logo.png',
          target: '_self',
        },
        items: [
          {
            type: 'dropdown',
            label: 'SDK',
            position: 'left',
            items: [
              {
                type: 'docSidebar',
                sidebarId: 'csharpSidebar',
                docsPluginId: 'csharp-sdk',
                label: 'C#',
              },
              {
                type: 'docSidebar',
                sidebarId: 'pythonSidebar',
                docsPluginId: 'python-sdk',
                label: 'Python',
              },
            ],
          },
          {
            type: 'dropdown',
            label: 'Orchestrator',
            position: 'left',
            items: [
              {
                type: 'docSidebar',
                sidebarId: 'dataServicesSidebar',
                docsPluginId: 'data-services',
                label: 'Data Services',
              },
              {
                type: 'docSidebar',
                sidebarId: 'conductorSidebar',
                docsPluginId: 'conductor',
                label: 'Conductor',
              },
              {
                type: 'docSidebar',
                sidebarId: 'designerSidebar',
                docsPluginId: 'designer',
                label: 'Designer',
              },
              {
                type: 'docSidebar',
                sidebarId: 'schedulerSidebar',
                docsPluginId: 'scheduler',
                label: 'Scheduler',
              },
              {
                type: 'docSidebar',
                sidebarId: 'executionAgentsSidebar',
                docsPluginId: 'execution-agents',
                label: 'Execution Agents',
              },
            ],
          },
          // Auth actions will be handled by swizzled navbar component
          {
            type: 'custom-AuthNavbarItems',
            position: 'right',
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
                label: 'API Overview',
                to: '/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Support Portal',
                href: 'https://support.biosero.com',
              },
              {
                label: 'Documentation',
                href: 'https://docs.biosero.com',
              },
            ],
          },
        ],
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
