"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    treeToSort(items) {
        let treeNodes = {};
        let roots = [];
        for (let item of items) {
            treeNodes[item.id] = { ...item, children: [], depth: 0 };
        }
        for (let item of items) {
            let node = treeNodes[item.id];
            if (item.parent !== null && item.parent !== undefined) {
                if (item.parent in treeNodes) {
                    treeNodes[item.parent].children.push(node);
                    node.depth = treeNodes[item.parent].depth + 1;
                }
            }
            else {
                roots.push(node);
            }
        }
        return roots;
    },
    sortToTree(entries) {
        let counter = 1;
        let result = [];
        function dfs(node, parent, depth = 0) {
            node.lft = counter++;
            node.parent = parent;
            if (node.children && node.children.length > 0) {
                depth++;
            }
            for (let child of node.children) {
                dfs(child, node.id, depth);
            }
            node.rght = counter++;
            result.push({
                id: node.id,
                lft: node.lft,
                rght: node.rght,
                parent: node.parent,
                depth: depth,
            });
        }
        for (let root of entries) {
            dfs(root, null);
        }
        return result;
    }
});
