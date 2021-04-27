/*
 * @Author: your name
 * @Date: 2021-04-25 18:45:21
 * @LastEditTime: 2021-04-25 19:03:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\343.整数拆分.java
 */
/*
 * @lc app=leetcode.cn id=343 lang=java
 *
 * [343] 整数拆分
 */

// @lc code=start
class Solution {
    public int integerBreak(int n) {
        int[] dp = new int[n + 1];
        for(int i = 2; i <= n; i++) {
            int curMax = 0;
            //i拆
            for(int j = 1; j <= i/2; j++) {
                //j拆与不拆！
                curMax = Math.max(curMax, Math.max(j * (i - j), j * dp[i - j]));
            }
            dp[i] = curMax;
        }
        return dp[n];
    }
}
// @lc code=end

