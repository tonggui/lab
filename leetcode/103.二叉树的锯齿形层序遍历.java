/*
 * @Author: your name
 * @Date: 2021-04-11 13:39:38
 * @LastEditTime: 2021-04-11 13:48:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \leetcode\103.二叉树的锯齿形层序遍历.java
 */
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import javax.swing.tree.TreeNode;

/*
 * @lc app=leetcode.cn id=103 lang=java
 *
 * [103] 二叉树的锯齿形层序遍历
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
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        if (root != null)
            q.add(root);
        while (!q.isEmpty()) {
            int size = q.size();
            LinkedList<Integer> cur = new LinkedList<>();
            while (size != 0) {
                TreeNode curNode =  q.poll();
                if (res.size() % 2 == 0 ){
                    cur.addLast(curNode.val);
                }else cur.addFirst(curNode.val);
                if (curNode.left != null){
                    q.add(curNode.left);
                }
                if (curNode.right != null){
                    q.add(curNode.right);
                }
                size--;
            }
            res.add(cur);
        }
        return res;
    }
}
// @lc code=end

