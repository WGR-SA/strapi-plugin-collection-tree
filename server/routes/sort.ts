export default [
  {
    method: 'GET',
    path: '/entries',
    handler: 'sortController.getEntries',
  },
  {
    method: 'POST',
    path: '/entries',
    handler: 'sortController.saveEntries',
  },
];
