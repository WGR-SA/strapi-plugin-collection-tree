export default [
  {
    method: 'GET',
    path: '/models',
    handler: 'settingsController.getModels',
  },
  {
    method: 'GET',
    path: '/settings',
    handler: 'settingsController.get',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'POST',
    path: '/settings',
    handler: 'settingsController.set',
    config: {
      policies: [],
      auth: false
    },
  },
];
 