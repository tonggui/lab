import java.util.Deque;
import java.util.LinkedList;

/*
 * @lc app=leetcode.cn id=239 lang=java
 *
 * [239] 滑动窗口最大值
 */

// @lc code=start
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int len = nums.length;
        if (len == 0)   return nums;
        int[] res = new int[len - k + 1];
        //deque中存储数组的index 而非值
        Deque<Integer> deque = new LinkedList<>();
        for (int i = 0;i < len;i++){
            //向右移动，当前窗口大于k时，移除left,保证窗口的长度范围
            if(!deque.isEmpty() && deque.getFirst() < (i - k + 1))
                deque.removeFirst();//poll()
            //队尾元素与队内元素比较，移除尾部小于当前值的元素
            //需保证队列为单调减，为有效元素
            while(!deque.isEmpty() && nums[i] >= nums[deque.getLast()])
                deque.removeLast();
            //队尾元素入队,滑动窗口
            deque.add(i);
            //返回队头即为当前窗口最大值
            if(i >= k - 1)
                res[i - k + 1] = nums[deque.getFirst()];
        }
        return res;
    }
}
// @lc code=end

