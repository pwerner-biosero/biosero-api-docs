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
        'Query Client',
        'Order Client',
        'Order Scheduler',
      ],
    },
  ],
};

export default pythonSidebars;