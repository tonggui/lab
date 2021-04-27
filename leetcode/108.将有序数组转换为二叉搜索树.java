/*
 * @Author: your name
 * @Date: 2021-03-15 22:31:19
 * @LastEditTime: 2021-03-15 22:46:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\108.将有序数组转换为二叉搜索树.java
 */
/*
 * @lc app=leetcode.cn id=108 lang=java
 *
 * [108] 将有序数组转换为二叉搜索树
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
    public TreeNode sortedArrayToBST(int[] nums) {
        if (nums.length == 0)   return null;
        return buildBST(nums, 0, nums.length - 1);        
    }
    public TreeNode buildBST(int[] nums, int left, int right) {
        if (left > right)   return null;
        int mid = (left + right)  / 2;
        TreeNode root = new TreeNode(nums[mid]);
        root.left = buildBST(nums, left, mid - 1);
        root.right = buildBST(nums, mid + 1, right); 
        return root;
    }

}
// @lc code=end

