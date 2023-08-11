export default [
  {
    method: 'POST',
    path: '/is-localized',
    handler: 'modelController.isLocalized',
    // config: {
    //   policies: [],
    //   auth: false,
    // }
  },

  {
    method: 'POST',
    path: '/get-display-field',
    handler: 'modelController.getDisplayField',
    // config: {
    //   policies: [],
    //   auth: false,
    // }
  },

];