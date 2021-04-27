/*
 * @Author: your name
 * @Date: 2021-02-16 14:43:06
 * @LastEditTime: 2021-02-17 09:50:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\34.在排序数组中查找元素的第一个和最后一个位置.java
 */
/*
 * @lc app=leetcode.cn id=34 lang=java
 *
 * [34] 在排序数组中查找元素的第一个和最后一个位置
 */

// @lc code=start
class Solution {
    public int[] searchRange(int[] nums, int target) {
        if(nums.length == 0)    return new int[]{-1,-1};
        int firstPosition = findFirstPosition(nums, target);
        if(firstPosition == -1) return new int[]{-1, -1};
        int lastPosition = findLastPosition(nums, target);
        return new int[]{firstPosition, lastPosition};
    }
    //左右夹击的方式去逼近「第 1 次出现的位置」和「最后 1 次出现的位置」
    // 如果找 「第 1 次出现的位置」，当前位置可能是，如果不是就继续向左找；
    // 如果找 「最后 1 次出现的位置」，当前位置可能是，如果不是就继续向右找。
    private int findFirstPosition(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while(left < right){
            //向右夹得向下取整，默认向下取整
            int mid = (right + left) >> 1;
             //下一轮搜索区间是 [mid + 1, right]
            if(nums[mid] < target)   left = mid + 1;
            //下一轮搜索区间是 [left, mid - 1]
            else if (nums[mid] > target)    right = mid - 1;
            //下一轮搜索区间是 [left, mid]
            //当 nums[mid] == target 成立的时候，mid 当然有可能是开始，也有可能是结束位置。
            //因为需要找开始位置，此时应该向前找（而不是在向前找的过程中，再去找结束位置）。
            else    right = mid;
        }
        if(nums[left] == target)    return left;
        return -1;
    }
    private int findLastPosition(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while(left < right){
    //细节：+1 上取整。元素个数为偶数的时候，中间数有两个，原来我们习惯或者说默认了下取整，事实上，上取整也可以。
    // 但是这里介绍的两边夹的写法，就需要区别对待，向左夹得向上取整。
            int mid = left + (right - left + 1) / 2;
             // nums[mid] < target，下一轮搜索区间是 [mid + 1, right]
            if(nums[mid] < target)   left = mid + 1;
             // 下一轮搜索区间是 [left, mid - 1]
            else if (nums[mid] > target)    right = mid - 1;
            // 下一轮搜索区间是 [mid, right]
            //left = mid 后需要修改mid = (l+r+1)//2,向上取整
            else    left = mid;
        }
        return left;
    }
}
// @lc code=end

