/*
 * @Author: your name
 * @Date: 2021-04-24 15:08:05
 * @LastEditTime: 2021-04-25 09:53:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\377.组合总和-ⅳ.java
 */
/*
 * @lc app=leetcode.cn id=377 lang=java
 *
 * [377] 组合总和 Ⅳ
 */

// @lc code=start
class Solution {
    public int combinationSum4(int[] nums, int target) {
        //使用dp数组，dp[i]代表组合数为i时使用nums中的数能组成的组合数的个数
        //dp[i]=dp[i-nums[0]]+dp[i-nums[1]]+dp[i=nums[2]]+...
        //举个例子比如nums=[1,3,4],target=7;
        //dp[7]=dp[6]+dp[4]+dp[3]
        //其实就是说7的组合数可以由三部分组成，1和dp[6]，3和dp[4],4和dp[3];
        int[] dp = new int[target+1];
        //是为了算上自己的情况，比如dp[1]可以由dp[0]和1这个数的这种情况组成。
        dp[0] = 1;
        for(int i = 1;i <= target; i++){
            for (int num : nums) {
                if (i >= num) {
                    dp[i] += dp[i - num];
                }
            }
        }
        return dp[target];
    }
}
// @lc code=end

