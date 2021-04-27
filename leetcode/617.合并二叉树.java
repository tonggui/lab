/*
 * @Author: your name
 * @Date: 2021-03-15 22:52:36
 * @LastEditTime: 2021-03-15 23:10:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\617.合并二叉树.java
 */
/*
 * @lc app=leetcode.cn id=617 lang=java
 *
 * [617] 合并二叉树
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
    public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
        //如果 r1和r2中，只要有一个是null，函数就直接返回
        if (root1 == null) {
            return root2;
        }
        if (root2 == null) {
            return root1;
        }
        int res = root1.val + root2.val;
        TreeNode root = new TreeNode(res);
        root.left = mergeTrees(root1.left,root2.left);
        root.right = mergeTrees(root1.right,root2.right);
        return root;
    }
}
// @lc code=end

