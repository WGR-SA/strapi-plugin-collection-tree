export default {
  default: {
    models: [],
    attributes: {
      page_order: {
        type: "integer",
        default: null
      },
      children: {
        type: "relation",
        relation: "oneToMany",
        target: "collection",
        mappedBy: "parent"
      }
    }
  }, 
  validator() {},
};
