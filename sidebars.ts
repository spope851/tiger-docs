import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/configuration',
        'getting-started/first-setup',
      ],
    },
    {
      type: 'category',
      label: 'User Guides',
      items: [
        'user-guides/teachers',
        'user-guides/parents',
        'user-guides/students',
        'user-guides/administrators',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/class-management',
        'features/grading-system',
        'features/report-cards',
        'features/enrollment-system',
        'features/microsoft-integration',
      ],
    },
    {
      type: 'category',
      label: 'Developer Guide',
      items: [
        'developer-guide/architecture',
        'developer-guide/database-schema',
        'developer-guide/api-reference',
        'developer-guide/shortcodes',
        'developer-guide/hooks-filters',
        'developer-guide/customization',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'deployment/requirements',
        'deployment/production-setup',
        'deployment/migrations',
        'deployment/troubleshooting',
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;
