/*
 * @Author: your name
 * @Date: 2021-03-14 11:35:43
 * @LastEditTime: 2021-03-14 11:44:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\Offer26.java
 */
public class Offer26 {
    public boolean isSubStructure(TreeNode A, TreeNode B) {
        //输入两棵二叉树A和B，判断B是不是A的子结构。(约定空树不是任意一个树的子结构)
        if (A == null || B == null) return false;
        return compareNode(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B);
    }
    public boolean compareNode(TreeNode A, TreeNode B) {
        if (B == null)  return true;
        if (A == null) return false;
        return A.val == B.val ? compareNode(A.left, B.left) && compareNode(A.right, B.right): false;
    }
}
