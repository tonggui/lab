/*
 * @Author: your name
 * @Date: 2021-04-03 16:06:48
 * @LastEditTime: 2021-04-03 16:54:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\15.三数之和.java
 */
import java.sql.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/*
 * @lc app=leetcode.cn id=15 lang=java
 *
 * [15] 三数之和
 */

// @lc code=start
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new  ArrayList<>();
        if (nums.length < 3)    return res;
        int len = nums.length;
        Arrays.sort(nums);
        for (int i = 0; i < len; i++){
            if (nums[i] > 0)  break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int L = i + 1;
            int R = len - 1;
            while (L < R){
                int sum = nums[i] + nums[L] + nums[R];
                if (sum == 0){
                    res.add(Arrays.asList(nums[i], nums[L], nums[R]));
                    while (L < R && nums[L] == nums[L + 1])
                        L++;
                    while (L < R && nums[R] == nums[R - 1])
                        R--;
                    L++;
                    R--;
                }
                else if (sum < 0)   L++;
                else R--;
            }
        }
        return res;
    }
}
// @lc code=end

