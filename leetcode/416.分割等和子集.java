/*
 * @Author: your name
 * @Date: 2021-04-11 09:07:37
 * @LastEditTime: 2021-04-11 10:22:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \leetcode\416.分割等和子集.java
 */
/*
 * @lc app=leetcode.cn id=416 lang=java
 *
 * [416] 分割等和子集
 */

// @lc code=start
class Solution {
    //dp[i][j]表示从数组的[0,i]内选取若干个正整数（可以是0个），
    //是否存在一种选取方案使得被选取的正整数的和等于 j
    public boolean canPartition(int[] nums) {
        int len = nums.length;
        if (len < 2)    return false;
        int sum = 0, maxNum = 0;
        for (int num : nums){
            sum += num;
            maxNum = Math.max(maxNum, num);
        }
        if (sum % 2 != 0) return false;
        int target = sum / 2;
        if (maxNum > target)    return false;
        boolean[][] dp = new boolean[len][target + 1];
        for (int i = 0; i < len; i++){
            dp[i][0] =true;
        }
        dp[0][nums[0]] = true;
        for (int i = 1; i < len; i++) {
            int num = nums[i];
            for (int j = 1; j <= target; j++) {
                //当前num 选 or 不选
                if (j >= num){
                    dp[i][j] = dp[i - 1][j] || dp[i - 1][j - num];
                }else dp[i][j] = dp[i - 1][j];
            }
        }
        return dp[len - 1][target];
    }
}
// @lc code=end

