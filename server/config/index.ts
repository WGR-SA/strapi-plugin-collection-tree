import type { CollectionTreeConfig } from '../../types'

const config: CollectionTreeConfig = {
  models: [],
  fieldname: {
    lft: "lft",
    rght: "rght",
    parent: "parent",
    children: "children"
  }
}

export default {
  default: config, 
  validator() {},
};
