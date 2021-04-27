import java.util.HashMap;
import java.util.Stack;

/*
 * @lc app=leetcode.cn id=496 lang=java
 *
 * [496] 下一个更大元素 I
 */

// @lc code=start
class Solution {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        //先将nums2中每个数离其最大的值放入到map中
        Stack<Integer> stack = new Stack<>();
        HashMap<Integer,Integer> map = new HashMap<>();
        for (int i = 0; i < nums2.length; i++) {
            int t = nums2[i];
            //从栈顶--->栈底为单调递增栈，若栈顶元素小于当前数，则更新当前栈
            while (!stack.isEmpty() && stack.peek() < t) {
                //使用map来记录右边比它大的数
                map.put(stack.peek(), nums2[i]);
                stack.pop();
            }
            stack.push(nums2[i]);
        }
        while (!stack.isEmpty()){
            map.put(stack.peek(), -1);
            stack.pop();
        }
        int n1 = nums1.length;
        //从map中得到nums1对应的最大数
        int[] res = new int[n1];
        for (int i = 0; i < n1; i++) {
            res[i] = map.get(nums1[i]);
        }
        return res;
    }
}
// @lc code=end

