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
      if (item.parent !== null && item.parent !== undefined) {
        if (item.parent in treeNodes) {
          treeNodes[item.parent].children.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    return roots
  },
  sortToTree(entries: SortItem[]): TreeItem[] {    
    let counter = 1;
    let result: TreeItem[] = [];

    function dfs(node: SortItem, parent: number | null) {
      node.lft = counter++;
      node.parent = parent;

      for (let child of node.children) {
        dfs(child, node.id);
      }

      node.rght = counter++;

      result.push({
        id: node.id,
        lft: node.lft as number,
        rght: node.rght as number,
        parent: node.parent as number
      });
    }

    for (let root of entries) {
      dfs(root, null);
    }

    return result;
  }
})