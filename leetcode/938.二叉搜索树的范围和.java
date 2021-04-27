import java.util.LinkedList;
import java.util.Queue;

import javax.swing.tree.TreeNode;

/*
 * @Author: your name
 * @Date: 2021-02-23 09:59:08
 * @LastEditTime: 2021-04-19 16:11:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\938.二叉搜索树的范围和.java
 */
/*
 * @lc app=leetcode.cn id=938 lang=java
 *
 * [938] 二叉搜索树的范围和
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
    public int rangeSumBST1(TreeNode root, int low, int high) {
        if (root == null)   return 0;
        int leftSum = rangeSumBST(root.left, low, high);
        int rightSum = rangeSumBST(root.right, low, high);
        int result = leftSum + rightSum;
        if (root.val >= low && root.val <= high)    
            result += root.val;
        return result;
    }
    public int rangeSumBST(TreeNode root, int low, int high) {
        if (root == null)   return 0;
        int result = 0;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (q.size() > 0){//队列不空,树没完
            int size = q.size();
            while (size > 0){ //每一层元素的size
                TreeNode cur = q.poll();
                if (cur.val >= low && cur.val <= high)
                    result += cur.val;
                if (cur.left != null)
                    q.add(cur.left);
                if (cur.right != null)
                    q.add(cur.right);
                size --;
            }
        }
        return result;
    }
}
// @lc code=end

