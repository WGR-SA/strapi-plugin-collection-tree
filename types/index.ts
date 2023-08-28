export type CollectionTreeConfig = {
  models: string[],
  fieldname: {
    lft: string,
    rght: string,
    parent: string,
    children: string,
    tree: string
  }
}

export interface TreeItem {
  id: number,
  lft: number,
  rght: number,
  parent: number | null,
  depth?: number,
  [key: string]: unknown
}

export interface SortItem {
  id: number,
  lft: number,
  rght: number,
  parent: number | null,
  children: SortItem[],
  depth: number,
  displayField?: string,
  [key: string]: unknown
}
