import java.util.Arrays;

/*
 * @Author: your name
 * @Date: 2021-04-10 16:09:03
 * @LastEditTime: 2021-04-10 17:45:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \leetcode\322.零钱兑换.java
 */
/*
 * @lc app=leetcode.cn id=322 lang=java
 *
 * [322] 零钱兑换
 */

// @lc code=start
class Solution {
    //dp，自底向上迭代
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 0; i < dp.length; i++) {
            for (int coin : coins) {
                if (i - coin < 0) continue;
                dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
            }
        }
        return (dp[amount] == amount + 1) ? -1 : dp[amount];
    }
    //备忘录，自顶向下
    int[] memo;
    public int coinChange1(int[] coins, int amount) {
        memo = new int[amount + 1];
        Arrays.fill(memo, -666);    
        return dp(coins, amount);
    }
    public int dp(int[] coins, int amount) {
        if (amount == 0)    return 0;
        if (amount < 0)   return -1;
        if (memo[amount] != -666)   return memo[amount];
        int res = Integer.MAX_VALUE;
        for (int coin : coins) {
            int subProblems = dp(coins, amount - coin);
            if (subProblems == -1)  continue;
            res = Math.min(res, subProblems + 1);
        }
        memo[amount] = (res ==Integer.MAX_VALUE) ? -1 : res;
        return memo[amount];
    }
}
// @lc code=end

