/*
 * @Author: your name
 * @Date: 2021-03-13 22:07:32
 * @LastEditTime: 2021-03-13 22:31:47
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\104.二叉树的最大深度.java
 */
/*
 * @lc app=leetcode.cn id=104 lang=java
 *
 * [104] 二叉树的最大深度
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
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
    }
}
// @lc code=end

