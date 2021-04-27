/*
 * @Author: your name
 * @Date: 2021-02-23 18:00:21
 * @LastEditTime: 2021-02-24 16:36:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\107.二叉树的层序遍历-ii.java
 */
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import javax.swing.tree.TreeNode;

/*
 * @lc app=leetcode.cn id=107 lang=java
 *
 * [107] 二叉树的层序遍历 II
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
    //DFS
    public List<List<Integer>> levelOrderBottom(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        dfs(root, res, 0);
        //反转数组
        Collections.reverse(res);
        return res;
    }
    public void dfs(TreeNode node, List<List<Integer>> res, int level) {
        if (node == null)   return;
        //当前result中需有对应层级的结果元素集，层级需和及结果集个数相等
        if (level > res.size() - 1)     res.add(new ArrayList<>());
        res.get(level).add(node.val);
        if (node.left != null)  dfs(node.left, res, level + 1);
        if (node.right != null)  dfs(node.right, res, level + 1);
    }
    //BFS
    public List<List<Integer>> levelOrderBottom1(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        //有时候有些代码中使用的数组不能和链表相互转化的，也不能返回给最终的结果集
        //可使用链表类型的临时变量来存放当前的结果，最终返回前可将临时变量变成最终要返回的类型
        LinkedList<ArrayList<Integer>> tmp = new LinkedList<>();
        while (q.size() > 0) {//当前while是每次进入新的层级里去
            int size = q.size();//当前层的元素（都已经放到q中）
            ArrayList<Integer> curRes =  new ArrayList<>();
            while (size > 0) {//当前同一层的所有元素遍历
                TreeNode cur = q.poll();
                curRes.add(cur.val);
                if(cur.left != null) q.add(cur.left);
                if(cur.right != null) q.add(cur.right);
                size--;
            }
            tmp.addFirst(curRes);
        }
        //将临时链表linkedList转为和返回类型一致
        res = new ArrayList<>(tmp);
        return res;
    }
}
// @lc code=end

