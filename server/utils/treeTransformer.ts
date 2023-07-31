import type { TreeItem, SortItem } from '../../types'

export default () => ({
  treeToSort(items: TreeItem[]): SortItem[] {
    let treeNodes: { [key: number]: SortItem } = {};
    let roots: SortItem[] = [];

    for (let item of items) {
      treeNodes[item.id] = { ...item, children: [] };
    }

    for (let item of items) {
      let node = treeNodes[item.id];
      if (item.parentId !== null && item.parentId !== undefined) {
        if (item.parentId in treeNodes) {
          treeNodes[item.parentId].children.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    return roots
  },
  sortToTree(entries: SortItem[]): TreeItem[] {
    console.log(entries);
    
    let counter = 1;
    let result: TreeItem[] = [];

    function dfs(node: SortItem, parentId: number | null) {
      node.lft = counter++;
      node.parentId = parentId;

      for (let child of node.children) {
        dfs(child, node.id);
      }

      node.rght = counter++;

      result.push({
        id: node.id,
        lft: node.lft as number,
        rght: node.rght as number,
        parentId: node.parentId as number
      });
    }

    for (let root of entries) {
      dfs(root, null);
    }

    return result;
  }
})