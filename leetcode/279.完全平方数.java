/*
 * @Author: your name
 * @Date: 2021-04-25 19:05:10
 * @LastEditTime: 2021-04-25 22:41:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\279.完全平方数.java
 */
/*
 * @lc app=leetcode.cn id=279 lang=java
 *
 * [279] 完全平方数
 */

// @lc code=start
class Solution {
    public int numSquares(int n) {
         // 默认初始化值都为0
        int[] dp = new int[n + 1];
        //dp[i]表示组成i的完全平方数个数
        for(int i = 0; i <= n; i++) {
            // 最坏的情况就是每次+1
            dp[i] = i;
            for (int j = 1; j * j <= i; j++) {
                // 动态转移方程
                dp[i] = Math.min(dp[i],dp[i - j * j] + 1);
            }
        }
        return dp[n];
    }
}
// @lc code=end

