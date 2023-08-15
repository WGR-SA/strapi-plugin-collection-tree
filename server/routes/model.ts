export default [
  {
    method: 'POST',
    path: '/is-localized',
    handler: 'modelController.isLocalized',
  },
  {
    method: 'GET',
    path: '/display-field',
    handler: 'modelController.getDisplayField',
  },

]