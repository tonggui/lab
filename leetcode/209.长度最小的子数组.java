/*
 * @Author: your name
 * @Date: 2021-02-20 20:24:25
 * @LastEditTime: 2021-02-20 20:41:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\209.长度最小的子数组.java
 */
/*
 * @lc app=leetcode.cn id=209 lang=java
 *
 * [209] 长度最小的子数组
 */

// @lc code=start
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        if (nums.length == 0)   return 0;
        int sum = 0;
        int res = nums.length + 1; //记录返回值
        int i = 0,j = i;
        while (j < nums.length){
            sum += nums[j];
            j ++;
            while (sum >=target){
                res = Math.min(res, j - i);
                sum = sum - nums[i];
                i ++;
            }
        }
        if (res == nums.length + 1)
            return 0;
        else    return res;

    }
}
// @lc code=end

