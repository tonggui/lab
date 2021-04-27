public class RemoveNode {
    public ListNode deleteNode(ListNode head, int val) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode pre = dummy;
        while (head != null){
            if(head.val == val)     pre.next = head.next;
            else    pre = head;
            head = head.next;
        }
        return dummy.next;
    }
}
/*
 * @Author: your name
 * @Date: 2021-02-21 18:47:11
 * @LastEditTime: 2021-02-21 18:47:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\删除链表的结点.java
 */
