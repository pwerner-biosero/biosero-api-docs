// @ts-check

/**
 * Python SDK Sidebar Configuration
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const pythonSidebars = {
  pythonSidebar: [
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
          id: 'Query Client',
          label: '🔍 Query Client',
        },
        {
          type: 'doc',
          id: 'Order Client',
          label: '📋 Order Client',
        },
        {
          type: 'doc',
          id: 'Order Scheduler',
          label: '⏰ Order Scheduler',
        },
      ],
    },
  ],
};

export default pythonSidebars;