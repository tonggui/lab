/*
 * @Author: your name
 * @Date: 2021-04-03 20:13:06
 * @LastEditTime: 2021-04-03 20:23:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\11.盛最多水的容器.java
 */
/*
 * @lc app=leetcode.cn id=11 lang=java
 *
 * [11] 盛最多水的容器
 */

// @lc code=start
class Solution {
    public int maxArea(int[] height) {
        int res = Integer.MIN_VALUE;
        int start = 0, end = height.length - 1;
        while (start < end) {
            int area = (end - start) * 
            (height[start] > height[end] ? height[end] : height[start]);
            res = Math.max(res, area);
            if (height[start] <= height[end])
                start++;
            else end--;
        }
        return res;
    }
}
// @lc code=end

