/*
 * @Author: your name
 * @Date: 2021-02-20 23:27:22
 * @LastEditTime: 2021-02-21 11:12:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\946.验证栈序列.java
 */
import java.util.Stack;

/*
 * @lc app=leetcode.cn id=946 lang=java
 *
 * [946] 验证栈序列
 */

// @lc code=start
class Solution {
    public boolean validateStackSequences(int[] pushed, int[] popped) {
    //私用一个stack来模拟入/出栈
        Stack<Integer> stack = new Stack<>();
        int index =0;
        for (int i : pushed){
    //将 pushed 队列中的每个数都 push 到栈中
            stack.push(i);
    //同时检查这个数是不是 popped 序列中下一个要 pop 的值，如果是就把它 pop 出来。
            while(!stack.isEmpty() && stack.peek() == popped[index]){
                stack.pop();
                index++;
            }
        }
        //检查不是所有的该 pop 出来的值都是 pop 出来了
        return stack.isEmpty();
    }
}
// @lc code=end

