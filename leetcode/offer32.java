import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

import javax.swing.tree.TreeNode;

/*
 * @Author: your name
 * @Date: 2021-03-13 22:37:00
 * @LastEditTime: 2021-03-13 23:03:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\offer3.java
 */
public class offer32 {
    //从上到下打印出二叉树的每个节点，同一层的节点按照从左到右的顺序打印。
    public int[] levelOrder(TreeNode root) {
        if (root == null)   return new int[]{};
        List<Integer> tmp = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()){
            int size = queue.size();
            while (size > 0){
                TreeNode cur = queue.poll();
                tmp.add(cur.val);
                if (cur.left != null)   queue.offer(cur.left);
                if (cur.right != null)   queue.offer(cur.right);
                size--;
            }
        }
        // 将 ArrayList 转为 int数组并返回
        int[] res = new int[tmp.size()];
        for (int i=0; i<res.length; i++) {
            res[i] = tmp.get(i);
        }
        return res;
    }
}
