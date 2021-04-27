/*
 * @Author: your name
 * @Date: 2021-02-15 13:27:25
 * @LastEditTime: 2021-02-15 20:50:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\154.寻找旋转排序数组中的最小值-ii.java
 */
/*
 * @lc app=leetcode.cn id=154 lang=java
 *
 * [154] 寻找旋转排序数组中的最小值 II
 */

// @lc code=start
class Solution {
    public int findMin(int[] nums) {
        int start = 0, end = nums.length - 1;
        while(start < end){
            int mid = (start+end)>>>1;
            if(nums[mid] < nums[end])
                end = mid;
            else if(nums[mid] > nums[end]) 
                start = mid+1;
            else
                end--;
        }
        return nums[start];
    }
}
// @lc code=end

