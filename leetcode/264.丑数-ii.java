/*
 * @Author: your name
 * @Date: 2021-03-14 20:06:57
 * @LastEditTime: 2021-03-14 21:09:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\264.丑数-ii.java
 */
/*
 * @lc app=leetcode.cn id=264 lang=java
 *
 * [264] 丑数 II
 */

// @lc code=start
class Solution {
    public int nthUglyNumber(int n) {
        int[] dp = new int[n];
        dp[0] = 1;
        int a = 0, b = 0, c = 0;
        for (int i = 1; i < n; i++){
            int n1 = 2 * dp[a];
            int n2 = 3 * dp[b];
            int n3 = 5 * dp[c];
            dp[i] = Math.min(Math.min(n1, n2), n3);
            if (dp[i] == n1)    a++;
            if (dp[i] == n2)    b++;
            if (dp[i] == n3)    c++;
        }
        return dp[n - 1];
    }
}
// @lc code=end

