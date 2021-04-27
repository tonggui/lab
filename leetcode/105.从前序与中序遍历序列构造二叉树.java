/*
 * @Author: your name
 * @Date: 2021-03-14 09:14:21
 * @LastEditTime: 2021-03-27 16:51:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\105.从前序与中序遍历序列构造二叉树.java
 */
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import javax.swing.tree.TreeNode;

/*
 * @lc app=leetcode.cn id=105 lang=java
 *
 * [105] 从前序与中序遍历序列构造二叉树
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    private Map<Integer, Integer> mapIndex;
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        int n = preorder.length;
        // 构造哈希映射，存储中序遍历中的元素和下标，帮助我们快速定位根节点
        mapIndex = new HashMap<Integer, Integer>();
        for (int i = 0; i < n; i++){
            mapIndex.put(inorder[i], i);
        }
        return buildTree(preorder, inorder, 0, n - 1, 0, n - 1);
    }
    public TreeNode  buildTree(int[] preorder, int[] inorder, int preLeft, int preRight, int inLeft, int inRight) {
        if (preLeft > preRight) return null;
        // 先把根节点建立出来
        TreeNode root = new TreeNode(preorder[preLeft]);
        // 在中序遍历中定位根节点
        int inRoot = mapIndex.get(preorder[preLeft]);
        // 得到左子树中的节点数目
        int subSize = inRoot - inLeft;
        // 递归地构造左子树，并连接到根节点
        // 先序遍历中「从 左边界+1 开始的 size_left_subtree」个元素就对应了中序遍历中「从 左边界 开始到 根节点定位-1」的元素
        root.left = buildTree(preorder, inorder, preLeft + 1, preLeft + subSize, inLeft , inRoot - 1);
        // 递归地构造右子树，并连接到根节点
        // 先序遍历中「从 左边界+1+左子树节点数目 开始到 右边界」的元素就对应了中序遍历中「从 根节点定位+1 到 右边界」的元素
        root.right = buildTree(preorder, inorder, preLeft + subSize + 1, preRight, inRoot + 1 , inRight);
        return root;
    }
    public TreeNode buildTree2(int[] preorder, int[] inorder) {
        if(preorder.length==0 || inorder.length==0) {
			return null;
		}
        TreeNode root = new TreeNode(preorder[0]);
        for (int i = 0; i < preorder.length; i++) {
            if (preorder[0] == inorder[i]) {
                int[] preLeft = Arrays.copyOfRange(preorder, 1, i + 1);
                int[] preRight = Arrays.copyOfRange(preorder, i + 1, preorder.length);
                int[] inLeft = Arrays.copyOfRange(inorder, 0, i);
                int[] inRight = Arrays.copyOfRange(inorder, i + 1, inorder.length);
                root.left = buildTree(preLeft, inLeft);
                root.right = buildTree(preRight, inRight);
                break;
            }
        }
        return root;
    }
}
// @lc code=end

