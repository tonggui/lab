/*
 * @Author: your name
 * @Date: 2021-03-19 08:01:09
 * @LastEditTime: 2021-04-19 13:46:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\78.子集.java
 */
import java.util.ArrayList;
import java.util.List;

/*
 * @lc app=leetcode.cn id=78 lang=java
 *
 * [78] 子集
 */

// @lc code=start
class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        res.add(new ArrayList<>());
        int len = nums.length;
        for (int i = 1; i <= len; i++) {
            backtracking(nums, res, i, 0, new ArrayList<>());
        }
        return res;
    }
    public void backtracking(int[] nums, List<List<Integer>> res,
     int len, int index, List<Integer> subset) {
        if (subset.size() == len) {
            res.add(new ArrayList<>(subset));
            return;
        }
        for (int i = index; i < nums.length; i++) {
            subset.add(nums[i]);
            backtracking(nums, res, len, i + 1,subset);
            subset.remove(subset.size() - 1);
        }
    }
    public List<List<Integer>> subsets1(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        res.add(new ArrayList<>());
        for (int i = 0; i < nums.length; i++) {
            int size = res.size();
            //从结果集中取出每个数来添加nums[i]
            for (int j = 0; j < size; j++) {
                List<Integer> tmp = new ArrayList<>(res.get(j));
                tmp.add(nums[i]);
                res.add(tmp);
            }
        }
        return res;
    }
}
// @lc code=end

