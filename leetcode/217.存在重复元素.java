/*
 * @Author: your name
 * @Date: 2021-04-18 16:28:10
 * @LastEditTime: 2021-04-18 16:36:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\217.存在重复元素.java
 */
import java.util.HashSet;
import java.util.Set;

/*
 * @lc app=leetcode.cn id=217 lang=java
 *
 * [217] 存在重复元素
 */

// @lc code=start
class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set set = new HashSet<>();
        for (int i = 0; i < nums.length; i++) {
            if(!set.contains(nums[i])) {
                set.add(nums[i]);
            }else {
                return true;
            }
        }
        return false;
    }
}
// @lc code=end

