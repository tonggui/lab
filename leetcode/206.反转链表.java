/*
 * @Author: your name
 * @Date: 2021-02-21 23:33:36
 * @LastEditTime: 2021-03-27 18:17:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\206.反转链表.java
 */
/*
 * @lc app=leetcode.cn id=206 lang=java
 *
 * [206] 反转链表
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        //递归退出条件
        if (head == null || head.next == null)  return head;
        ListNode res = reverseList(head.next);
        head.next.next = head;
        head.next = null;
        return res;
    }
    public ListNode reverseList2(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        while (head !=null && head.next !=null){
            ListNode dnext = dummy.next;
            ListNode next = head.next;
            //头指针指向头节点
            dummy.next = next;
            head.next = next.next;
            next.next = dnext;
        }
        return dummy.next;
    }
}
// @lc code=end

