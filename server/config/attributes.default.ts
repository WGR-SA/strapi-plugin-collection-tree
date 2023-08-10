export default {
  lft: {
    type: 'integer',
    default: null
  },
  rght: {
    type: 'integer',
    default: null
  },
  children: {
    type: 'relation',
    relation: 'oneToMany',
    target: 'collection',
    mappedBy: 'parent'
  }
}