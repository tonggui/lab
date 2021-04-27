/*
 * @Author: your name
 * @Date: 2021-02-15 21:13:06
 * @LastEditTime: 2021-02-15 21:32:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\调整数组顺序.java
 */
/*
剑指 Offer 21. 调整数组顺序使奇数位于偶数前面
输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数位于数组的前半部分，所有偶数位于数组的后半部分。
示例：前奇后偶
输入：nums = [1,2,3,4]
输出：[1,3,2,4] 
注：[3,1,2,4] 也是正确的答案之一。
*/
class Solution {
    public int[] exchange(int[] nums) {
    //从数组前后同时向中间移
    int left = 0,right = nums.length - 1;
    while(left<right)
    {
        if(nums[left]%2!=0){
            left++;
        }else{
            swap(nums,left,right);
            right --;
        }
        if(nums[right]%2==0){
            right--;
        }else{
            swap(nums,left,right);
            left ++;
        }
    }
    return nums;
}
public static int[] swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
    return nums;
}
}
