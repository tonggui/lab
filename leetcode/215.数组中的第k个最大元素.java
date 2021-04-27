/*
 * @Author: your name
 * @Date: 2021-04-11 11:24:39
 * @LastEditTime: 2021-04-11 12:45:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \leetcode\215.数组中的第k个最大元素.java
 */

/*
 * @lc app=leetcode.cn id=215 lang=java
 *
 * [215] 数组中的第K个最大元素
 */

// @lc code=start
class Solution {
    public int findKthLargest(int[] nums, int k) {
        int len = nums.length;
        int left = 0, right = len - 1;
        int target = nums.length - k;
        while (true) {
            int index = partition(nums, left, right);
            if (index == target)    return nums[index];
            else if(index < target) left = index + 1;
            else right = index - 1;
        }
    }
    public int partition(int[] nums, int left, int right) {
        if (right > left) {
            // 在区间随机选择一个元素作为标定点
            int randomIndex = left + 1 + (int)Math.random() * (right - left);
            swap(nums, left, randomIndex);
        }
        int pivot = nums[left];
        int j = left;
        for (int i = left + 1; i <= right; i++) {
            if (nums[i] < pivot){
        // 小于 pivot 的元素都被交换到前面
                j++;
                swap(nums, j, i);
            }
        }
        // 在之前遍历的过程中，满足 [left + 1, j] < pivot，并且 (j, i] >= pivot
        swap(nums, j, left);
        // 交换以后 [left, j - 1] < pivot, nums[j] = pivot, [j + 1, right] >= pivot
        return j;
    }
    private void swap(int[] nums, int index1, int index2) {
        int temp = nums[index1];
        nums[index1] = nums[index2];
        nums[index2] = temp;
    }
}
// @lc code=end

