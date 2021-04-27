/*
 * @Author: your name
 * @Date: 2021-02-22 00:15:17
 * @LastEditTime: 2021-02-22 00:43:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\21.合并两个有序链表.java
 */
/*
 * @lc app=leetcode.cn id=21 lang=java
 *
 * [21] 合并两个有序链表
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
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode mergeNode = new ListNode(-1);
        ListNode prev = mergeNode;
        while (l1 != null && l2 != null){
            if (l1.val <= l2.val){
                prev.next = l1;
                l1 = l1.next;
            }else {
                prev.next = l2;
                l2 = l2.next;
            }
            prev =  prev.next;
        }
         // 合并后 l1 和 l2 最多只有一个还未被合并完
         //我们直接将链表末尾指向未合并完的链表即可
         prev.next = l1 == null ? l2 : l1;
        return mergeNode.next;
    }
}
// @lc code=end

