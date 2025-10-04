// @ts-check

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  csharpSidebar: [
    'intro',
    {
      type: 'category',
      label: '🚀 Getting Started',
      items: [
        'intro',
      ],
    },
    {
      type: 'category', 
      label: '📚 Client Libraries',
      items: [
        {
          type: 'doc',
          id: 'CSharp Query Client',
          label: '🔍 Query Client',
        },
        {
          type: 'doc',
          id: 'CSharp Order Client', 
          label: '📋 Order Client',
        },
        {
          type: 'doc',
          id: 'CSharp Accessioning Client',
          label: '🏷️ Accessioning Client',
        },
      ],
    },
    {
      type: 'category',
      label: '🔒 Protected Content',
      items: [
        {
          type: 'doc',
          id: 'test-page',
          label: '🧪 Test Page',
        },
      ],
    },
  ],
};

export default sidebars;