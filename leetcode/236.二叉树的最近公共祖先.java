import java.util.HashMap;
import java.util.HashSet;

import javax.swing.tree.TreeNode;

/*
 * @Author: your name
 * @Date: 2021-03-14 08:35:01
 * @LastEditTime: 2021-03-14 09:14:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\236.二叉树的最近公共祖先.java
 */
/*
 * @lc app=leetcode.cn id=236 lang=java
 *
 * [236] 二叉树的最近公共祖先
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
    //找到所有节点的父节点存储在hashmap中，对p和q往上回溯，
    //使用hashset进行保存p节点往上整条链的所有节点(p的祖先节点)
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        //map收集所有的节点的父节点
        HashMap<TreeNode, TreeNode> map = new HashMap<>();
        map.put(root, root);
        process(root, map);
        //使用set找到p的所有祖先
        HashSet<TreeNode> set = new HashSet<>();
        //在set中保存p的所有祖先节点
        TreeNode cur = p;
        while (cur != map.get(cur)) {
            set.add(cur);
            cur = map.get(cur);
        }
        set.add(root);
        //q往上窜，对q的每个祖先判断是否在set中
        cur = q;
        while (cur != map.get(cur)) {
            if (set.contains(cur))  return cur;
            cur = map.get(cur);
        }
        return root;
    }
    public static void process(TreeNode root, HashMap<TreeNode, TreeNode> map){
        if (root == null)   return;
        map.put(root.left, root);
        map.put(root.right, root);
        process(root.left, map);
        process(root.right, map);
    }
    public TreeNode lowestCommonAncestor2(TreeNode root, TreeNode p, TreeNode q) {
        //若找到p||q节点，就返回
        if (root == null || root == p || root == q) return root;
        //去子树找p、q节点，哪棵树找到就返回
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        //如果两棵树都不为null，则祖先节点为其根节点
        if (left != null && right != null)  return root;
        //左右两棵树并不都是有返回值，说明在同一颗子树上，pq中一个为其祖先节点
        return left != null ? left : right;
    }
}
// @lc code=end

