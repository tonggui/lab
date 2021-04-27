/*
 * @lc app=leetcode.cn id=162 lang=java
 *
 * [162] 寻找峰值
 */

// @lc code=start
class Solution {
    //每当我们遇到数字 nums[i]，只需要检查它是否大于下一个元素 
    // nums[i+1]即可判断 nums[i]是否是峰值。
    public int findPeakElement(int[] nums) {
        int left = 0, right = nums.length - 1;
        while (left < right){
            int mid = left + (right - left)/2;
            if (nums[mid] > nums[mid + 1])
                right = mid;
            else
                left = mid + 1;
        }
        return left;
    }
}
// @lc code=end

