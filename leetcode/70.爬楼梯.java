/*
 * @Author: your name
 * @Date: 2021-03-14 14:41:34
 * @LastEditTime: 2021-03-14 14:51:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\70.爬楼梯.java
 */
/*
 * @lc app=leetcode.cn id=70 lang=java
 *
 * [70] 爬楼梯
 */

// @lc code=start
class Solution {
    public int climbStairs(int n) {
        if (n == 1) return 1;
        int[] dp = new int[n + 1];
        dp[1] = 1;
        dp[0] = 1;
        for (int i = 2; i <= n; i++){
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
    public int climbStairs2(int n) {
        if (n == 1 || n == 0) return 1;
        return climbStairs(n - 1) + climbStairs(n - 2);
    }
}
// @lc code=end

