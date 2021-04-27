/*
 * @Author: your name
 * @Date: 2021-04-11 11:18:23
 * @LastEditTime: 2021-04-11 11:21:46
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \leetcode\136.只出现一次的数字.java
 */
/*
 * @lc app=leetcode.cn id=136 lang=java
 *
 * [136] 只出现一次的数字
 */

// @lc code=start
class Solution {
    public int singleNumber(int[] nums) {
        int len = nums.length;
        if (len == 1) return nums[0];
        int res = 0;
        for (int i = 0; i < len; i++) {
            res ^= nums[i];
        }
        return res;
    }
}
// @lc code=end

