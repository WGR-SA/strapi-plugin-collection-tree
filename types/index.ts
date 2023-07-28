export interface TreeItem {
  id: number,
  lft: number,
  rght: number,
  parent_id: number | null,
  [key: string]: unknown
}

export interface SortItem {
  id: number,
  lft: number,
  rght: number,
  parent_id: number | null,
  children: SortItem[],
  [key: string]: unknown
}
