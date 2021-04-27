import java.util.Arrays;

/*
 * @Author: your name
 * @Date: 2021-04-03 21:40:01
 * @LastEditTime: 2021-04-03 22:56:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\31.下一个排列.java
 */
/*
 * @lc app=leetcode.cn id=31 lang=java
 *
 * [31] 下一个排列
 */

// @lc code=start
class Solution {
    public void nextPermutation(int[] nums) {
        int len = nums.length;
        if (len == 1)   return;
        int i;
        for (i = len - 1; i > 0; i--){
            if (nums[i] > nums[i - 1]){
                int min = binary(nums,nums[i - 1], i, len - 1);
                swap(nums, i - 1, min);
                reverse(nums, i, nums.length - 1);
                return;
            }
        }
        reverse(nums, 0, len - 1);
        return;
    }
    public int binary(int[] nums, int target, int start, int end) {
        while (start < end){
            int mid = (start + end + 1) >> 1;
            //求比target大的最右边第一个数,当mid取右边界时，left = mid
            //当right = mid时，mid无需+1
            if (nums[mid] > target) start = mid;
            else end = mid - 1;
        }
        return start;
    }
    public static void swap(int[] nums, int i, int j) {
        int tmp = nums[i];
        nums[i] = nums[j];
        nums[j] = tmp;
    }
    public void reverse(int[] nums, int start, int end) {
        while (start < end) {
            swap(nums, start++, end--);
        }
        System.out.println(Arrays.toString(nums));
    }
}
// @lc code=end

