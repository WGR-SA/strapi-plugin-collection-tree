export type CollectionTreeConfig = {
  models: string[],
  fieldname: {
    lft: string,
    rght: string,
    parent: string,
    children: string,
  }
}

export interface TreeItem {
  id: number,
  lft: number,
  rght: number,
  parent: number | null,
  [key: string]: unknown
}

export interface SortItem {
  id: number,
  lft: number,
  rght: number,
  parent: number | null,
  children: SortItem[],
  displayField?: string,
  [key: string]: unknown
}
