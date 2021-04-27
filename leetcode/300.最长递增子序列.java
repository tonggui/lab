/*
 * @Author: your name
 * @Date: 2021-04-10 19:36:23
 * @LastEditTime: 2021-04-10 23:25:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \leetcode\300.最长递增子序列.java
 */
/*
 * @lc app=leetcode.cn id=300 lang=java
 *
 * [300] 最长递增子序列
 */

// @lc code=start
class Solution {
    //定义dp[i]为考虑前i个元素，以第i个数字结尾的最长上升子序列的长度，注意nums[i]必须被选取。
    public int lengthOfLIS(int[] nums) {
        if (nums.length == 0)
            return 0;
        int[] dp = new int[nums.length];
    //dp[i]的初始值可以全部设为1，因为每一个数都有可能是最长子序列的起点。
    //dp[i]是以之前任意可能的位置为起点到此的最大上升子序列长度。
        dp[0] = 1;
        int maxRes = 1;
        for (int i = 1; i < nums.length; i++) {
            dp[i] = 1;
            for (int j = 0; j < i; j++) {
                if (nums[i] > nums[j])
                    dp[i] = Math.max(dp[i], dp[j] + 1);
            }
            maxRes = Math.max(dp[i], maxRes);
        }
        return maxRes;
    }
}
// @lc code=end

