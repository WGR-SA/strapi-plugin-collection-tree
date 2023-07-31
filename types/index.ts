export interface TreeItem {
  id: number,
  lft: number,
  rght: number,
  parentId: number | null,
  [key: string]: unknown
}

export interface SortItem {
  id: number,
  lft: number,
  rght: number,
  parentId: number | null,
  children: SortItem[],
  [key: string]: unknown
}
