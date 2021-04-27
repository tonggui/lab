/*
 * @Author: your name
 * @Date: 2021-03-14 00:01:51
 * @LastEditTime: 2021-03-14 00:28:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\235.二叉搜索树的最近公共祖先.java
 */
/*
 * @lc app=leetcode.cn id=235 lang=java
 *
 * [235] 二叉搜索树的最近公共祖先
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {

        if (p.val <= root.val && root.val <= q.val || p.val >= root.val && root.val >= q.val)   return root;
        return lowestCommonAncestor(p.val < root.val ? root.left : root.right, p, q);
    }
}
// @lc code=end

