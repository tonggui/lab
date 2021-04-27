/*
 * @Author: your name
 * @Date: 2021-02-21 22:26:06
 * @LastEditTime: 2021-02-21 23:06:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\203.移除链表元素.java
 */
/*
 * @lc app=leetcode.cn id=203 lang=java
 *
 * [203] 移除链表元素
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
    public ListNode removeElements(ListNode head, int val) {
        //边界条件判断
        if (head == null)
            return head;
        //初始化一个虚拟节点
        ListNode dummy = new ListNode(0);
        //让虚拟节点指向头结点
        dummy.next = head;
        ListNode pre = dummy;
        while (head != null){
            if(head.val == val){
                pre.next = head.next;
            }else pre = head;
            head = head.next;
        }
        return dummy.next;
    }
}
// @lc code=end

