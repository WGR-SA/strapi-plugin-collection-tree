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
      if (item.parent_id !== null && item.parent_id !== undefined) {
        if (item.parent_id in treeNodes) {
          treeNodes[item.parent_id].children.push(node);
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
      node.parent_id = parentId;

      for (let child of node.children) {
        dfs(child, node.id);
      }

      node.rght = counter++;

      result.push({
        id: node.id,
        lft: node.lft as number,
        rght: node.rght as number,
        parent_id: node.parent_id as number
      });
    }

    for (let root of entries) {
      dfs(root, null);
    }

    return result;
  }
})