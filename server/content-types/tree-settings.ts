module.exports = {
  kind: 'singleType',
  collectionName: 'tree-settings',
  info: {
    singularName: 'tree-settings', // kebab-case mandatory
    displayName: 'Tree Settings',
    description: 'Settings for Collection Tree plugin',
  },
  options: {
    draftAndPublish: false,
  },
  pluginOptions: {
    'content-manager': {
      visible: false,
    },
    'content-type-builder': {
      visible: false,
    }
  },
  attributes: {
    models: {
      type: 'models' // todo
    },
  }
};