/*
 * @Author: your name
 * @Date: 2021-02-22 11:18:54
 * @LastEditTime: 2021-03-14 14:27:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\509.斐波那契数.java
 */
/*
 * @lc app=leetcode.cn id=509 lang=java
 *
 * [509] 斐波那契数
 */

// @lc code=start
class Solution {
    public int fib(int n) {
        if(n == 0) return 0;
        int[] dp = new int[n + 1];
        dp[0] = 0;
        dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
            dp[i] %= 1000000007;
        }
        return dp[n];
    }

    public int fib2(int n) {
        if (n < 2)
            return n == 0? 0 : 1;
        return fib(n - 1) + fib(n - 2);
    }
}
// @lc code=end

