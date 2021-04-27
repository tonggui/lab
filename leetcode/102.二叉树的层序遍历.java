/*
 * @Author: your name
 * @Date: 2021-02-23 11:30:20
 * @LastEditTime: 2021-03-14 00:01:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\102.二叉树的层序遍历.java
 */
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Deque;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import javax.swing.tree.TreeNode;

/*
 * @lc app=leetcode.cn id=102 lang=java
 *
 * [102] 二叉树的层序遍历
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
    public List<List<Integer>> levelOrder(TreeNode root) {
        // 按照之字形顺序打印二叉树，即第一行按照从左到右的顺序打印，
        // 第二层按照从右到左的顺序打印，第三行再按照从左到右的顺序打印，其他行以此类推。
        //分奇偶层,需使用双链表对结果集进行冲头插入还是尾插入
        List<List<Integer>> res = new ArrayList<>();
        Queue<TreeNode> q = new LinkedList<>();
        if (root != null)   q.add(root);
        while (!q.isEmpty()) {
            int size = q.size();
            LinkedList<Integer> curRes = new LinkedList<>();
            while (size > 0){
                TreeNode cur = q.poll();
                if (res.size() % 2 == 0)    curRes.addLast(cur.val);//偶数层 -> 队列头部
                else    curRes.addFirst(cur.val);//奇数层 -> 队列尾部
                if (cur.left != null) q.add(cur.left);
                if (cur.right != null) q.add(cur.right);
                size--;
            }
            res.add(curRes);
        }
        return res;
    }
    //BFS
    public List<List<Integer>> levelOrder1(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        int h = 0;
        while (q.size() > 0) {//栈不空，每一次遍历都是新层级
            int size = q.size();//取栈长度---当前层的结点数
            ArrayList<Integer> curRes = new  ArrayList<>();
            while (size > 0) { //遍历当层所有元素
                TreeNode cur = q.poll();
                curRes.add(cur.val);
                if (cur.left != null) q.add(cur.left);
                if (cur.right != null) q.add(cur.right);
                size--;
            }
            res.add(curRes);
            h++;
        }
        return res;
    }
    //DFS
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        dfs(root, res, 0);
        return res;
    }
    public void dfs(TreeNode node,List<List<Integer>> res,int level){
        //递归终止条件
        if (node == null) return;
        //若当前层数大于结果集中的数组长度，则需创建一个新数组来装当前level的元素
        if (level > res.size() - 1)
            res.add(new ArrayList<>());
        res.get(level).add(node.val);
        if (node.left != null)  dfs(node.left, res, level + 1);
        if (node.right != null)  dfs(node.right, res, level + 1);
    }
}
// @lc code=end

