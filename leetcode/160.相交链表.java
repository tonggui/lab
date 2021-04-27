/*
 * @Author: your name
 * @Date: 2021-02-22 08:35:40
 * @LastEditTime: 2021-02-22 09:02:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\160.相交链表.java
 */
/*
 * @lc app=leetcode.cn id=160 lang=java
 *
 * [160] 相交链表
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        if (headA == null || headB == null) return null;
        ListNode curA = headA,curB = headB;
        while (curA != curB){
            curA = curA.next;
            curB = curB.next;
            if (curA == null && curB == null)
                return null;
            if (curA == null)   curA = headB;
            if (curB == null)   curB = headA;
        }
        return curA;
    }
}
// @lc code=end

