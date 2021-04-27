/*
 * @Author: your name
 * @Date: 2021-04-25 17:46:22
 * @LastEditTime: 2021-04-25 18:30:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\413.等差数列划分.java
 */
/*
 * @lc app=leetcode.cn id=413 lang=java
 *
 * [413] 等差数列划分
 */

// @lc code=start
class Solution {
    public int numberOfArithmeticSlices(int[] nums) {
        int len = nums.length;
        if(len <= 2) return 0;
        int[] dp = new int[len];
        dp[0] = 0;
        dp[1] = 0;
        int res = 0;
        for (int i = 2; i < len; i++) {
            if(nums[i] - nums[i - 1] == nums[i - 1] - nums[i - 2]){
                dp[i] = 1 + dp[i - 1];
                res += dp[i];
            }
        }
        return res;
    }
}
// @lc code=end

