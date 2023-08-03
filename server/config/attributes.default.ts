export default {
  lft: {
    type: "integer",
    visible: false,
    default: null
  },
  rght: {
    type: "integer",
    visible: false,
    default: null
  },
  parent: {
    type: "relation",
    relation: 'oneToOne',
    target: "collection",
    visible: true
  }
}