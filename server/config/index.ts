import type { CollectionTreeConfig } from '../../types'

const config: CollectionTreeConfig = {
  models: [],
  fieldname: {
    lft: "lft",
    rght: "rght",
    parent: "parent",
    children: "children",
    tree: "tree"
  }
}

export default {
  default: config, 
  validator() {},
};
