/*
 * @Author: your name
 * @Date: 2021-02-22 12:18:33
 * @LastEditTime: 2021-03-14 16:07:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\53.最大子序和.java
 */
/*
 * @lc app=leetcode.cn id=53 lang=java
 *
 * [53] 最大子序和
 */

// @lc code=start
class Solution {
    public int maxSubArray(int[] nums) {
        int n = nums.length;
        if(n == 0)  return 0;
        int res = nums[0];
        int pre = 0;
        for (int i = 0; i < n; i++){
           pre = Math.max(nums[i], pre + nums[i]);
           res = Math.max(res, pre);
        }
        return res;
    }
        public int maxSubArray3(int[] nums) {
            int n = nums.length;
            if(n == 0)  return 0;
            //dp[i]表示以第i个数结尾的「连续子数组的最大和」
            int[] dp = new int[n];
            dp[0] = nums[0];
            for (int i = 1; i < n; i++){
                dp[i] = Math.max(nums[i],nums[i] + dp[i-1]);
            }
            int res = Integer.MIN_VALUE;
            for (int i = 0;i < n; i++){
                res = dp[i] < res ? res : dp[i];
            }
            return res;
        }
    public int maxSubArray2(int[] nums) {
        int res = Integer.MIN_VALUE;
        int count = 0;
        int len = nums.length;
        for (int i = 0; i < len; i++){  // 设置起始位置
            count = 0;
            // 每次从起始位置i开始遍历寻找最大值
            for (int j = i; j < len; j++){ 
                count += nums[j];
                res = count > res ? count : res;
            }
        }
        return res;
    }
}
// @lc code=end

