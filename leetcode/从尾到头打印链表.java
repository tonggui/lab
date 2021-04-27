/*
 * @Author: your name
 * @Date: 2021-02-18 14:07:56
 * @LastEditTime: 2021-02-20 21:49:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\从尾到头打印链表.java
 */
import java.util.Stack;

/*
输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。
    示例 1：
    输入：head = [1,3,2]
    输出：[2,3,1]
*/
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */
class Solution {
    public int[] reversePrint(ListNode head) {
        Stack<Integer> stack = new Stack<>();
          ListNode temp = head;
          while (temp != null){
              stack.push(temp.val);
              temp = temp.next;
          }
          int size = stack.size();
          int[] print = new int[size]; 
          for (int i = 0; i < size; i++){
              print[i] = stack.pop();
          }
          return print;
      }
    //     LinkedList<Integer> link = new LinkedList<>();
    //     int[] res = new int[head.size()];
    //     for (int i = 0; i < head.size(); i ++){
    //         if(head !=null && head.next !=null){
    //             res[i] = head.val;
    //         }
    //     }
    //     res = reverse(res);
    //     return res;
    // }
    // public static  int[] reverse(int[] arr) {
    //     for(int i = 0;i < arr.length/2; i++){
    //         int temp = arr[i];
    //         arr[arr.length - 1 - i] = arr[i];
    //         arr[i] = temp;
    //     }
    //     return arr;
    // }
}