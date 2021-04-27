/*
 * @lc app=leetcode.cn id=152 lang=java
 *
 * [152] 乘积最大子数组
 */

// @lc code=start
class Solution {
    public int maxProduct(int[] nums) {
        int len = nums.length;
        if( len == 1)    return nums[0];
        //相加初始值是0，相乘初始就是1。
        int maxRes = nums[0];
        //两个mDP分别定义为以i结尾的子数组的最大积与最小积；
        int[] maxDp = new int[nums.length];
        int[] minDp = new int[nums.length];
        maxDp[0] = nums[0];
        minDp[0] = nums[0];;
        for (int i = 1; i < len; i++) {
    //最大积的可能情况有：元素i自己本身，上一个最大积与i元素累乘，上一个最小积与i元素累乘；
    //与i元素自己进行比较是为了处理i元素之前全都是0的情况；
            maxDp[i] = Math.max(Math.max(maxDp[i - 1] * nums[i], minDp[i - 1] * nums[i]), nums[i]);
            minDp[i] = Math.min(Math.min(maxDp[i - 1] * nums[i], minDp[i - 1] * nums[i]), nums[i]);
            maxRes = Math.max(maxRes, maxDp[i]);
        }
        return maxRes;
    }
}
// @lc code=end

