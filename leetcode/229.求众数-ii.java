/*
 * @Author: your name
 * @Date: 2021-02-16 14:19:39
 * @LastEditTime: 2021-02-16 14:38:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\229.求众数-ii.java
 */
import java.util.ArrayList;
import java.util.List;

/*
 * @lc app=leetcode.cn id=229 lang=java
 *
 * [229] 求众数 II
 */

// @lc code=start
class Solution {
    public List<Integer> majorityElement(int[] nums) {
        List<Integer> res = new ArrayList<>();
        if (nums == null || nums.length == 0) return res;
        int candidate1 = nums[0], count1 = 0;
        int candidate2 = nums[0], count2 = 0;
        // 摩尔投票法，分为两个阶段：配对阶段和计数阶段
        // 配对阶段
        for(int num : nums){
            //投票
            if(candidate1 == num){
                count1++;
                continue;
            }
            if(candidate2 == num){
                count2++;
                continue;
            }
            //配对
            if(count1 == 0){
                candidate1 = num;
                count1++;
                continue;
            }
            if(count2 == 0){
                candidate2 = num;
                count2++;
                continue;
            }
            count1--;
            count2--;
        }
        // 计数阶段:找到了两个候选人之后，需要确定票数是否满足大于 N/3
        count1 = 0;
        count2 = 0;
        for (int num : nums){
            if (candidate1 == num) count1++;
            else if (candidate2 == num) count2++;
        }
        if(count1 > nums.length / 3)  res.add(candidate1);
        if(count2 > nums.length / 3)  res.add(candidate2);
        return res;
    }
}
// @lc code=end

