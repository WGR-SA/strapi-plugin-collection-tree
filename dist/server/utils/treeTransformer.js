"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    treeToSort(items) {
        let treeNodes = {};
        let roots = [];
        for (let item of items) {
            treeNodes[item.id] = { ...item, children: [] };
        }
        for (let item of items) {
            let node = treeNodes[item.id];
            if (item.parent !== null && item.parent !== undefined) {
                if (item.parent in treeNodes) {
                    treeNodes[item.parent].children.push(node);
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
        function dfs(node, parent) {
            node.lft = counter++;
            node.parent = parent;
            for (let child of node.children) {
                dfs(child, node.id);
            }
            node.rght = counter++;
            result.push({
                id: node.id,
                lft: node.lft,
                rght: node.rght,
                parent: node.parent
            });
        }
        for (let root of entries) {
            dfs(root, null);
        }
        return result;
    }
});
