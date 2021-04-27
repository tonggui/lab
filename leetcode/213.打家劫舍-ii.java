/*
 * @Author: your name
 * @Date: 2021-04-25 12:51:54
 * @LastEditTime: 2021-04-25 14:49:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\213.打家劫舍-ii.java
 */
import java.util.Arrays;

/*
 * @lc app=leetcode.cn id=213 lang=java
 *
 * [213] 打家劫舍 II
 */

// @lc code=start
class Solution {
    public int rob(int[] nums) {
        int len = nums.length;
        if(len == 0)    return 0;
        if(len == 1)   return nums[0];
        if (len == 2) return Math.max(nums[0], nums[1]);
        return Math.max(myRob(nums, 0, nums.length - 2), myRob(nums, 1, nums.length - 1));
    }

    public int myRob(int[] nums, int start, int end) {
        if (start == end) {
            return nums[start];
        }
        // int[] dp = new int[len];
        // dp[start] = nums[start];
        // dp[start + 1] = Math.max(nums[start], nums[start + 1]);
        // for (int i = start + 2; i <= end; i++) {
        //     dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
        // }
        // return dp[end];
        //滚动数组
        int pre = nums[start];
        int cur = Math.max(nums[start], nums[start + 1]);
        for (int i = start + 2; i <= end; i++) {
            int tmp = cur;
            cur = Math.max(pre + nums[i], cur);
            pre = tmp;
        }
        return cur;
    }
}
// @lc code=end

