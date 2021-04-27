import java.util.Stack;

import javax.swing.tree.TreeNode;

import org.graalvm.compiler.debug.CounterKey;

/*
 * @Author: your name
 * @Date: 2021-03-13 21:37:06
 * @LastEditTime: 2021-03-13 22:04:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\Offer-54.java
 */
//给定一棵二叉搜索树，请找出其中第k大的节点。
public class Offer54 {
    //给定一棵二叉搜索树，请找出其中第k大的节点。
    int res = 0, count = 0;
    public int kthLargest(TreeNode root, int k) {
        this.count = k;
        dfs(root);
        return this.res;
    }
    public void dfs(TreeNode root) {
        if (root == null || this.count==0) return;
        dfs(root.right);
        if (--this.count == 0){
            this.res = root.val;
            return;
        }
        dfs(root.left);
    }
}
