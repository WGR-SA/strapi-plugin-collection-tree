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
  },
  {
    method: 'POST',
    path: '/settings',
    handler: 'settingsController.set',
  },
];