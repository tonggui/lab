/*
 * @Author: your name
 * @Date: 2021-02-18 13:45:42
 * @LastEditTime: 2021-02-18 14:02:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\135.分发糖果.java
 */
/*
 * @lc app=leetcode.cn id=135 lang=java
 *
 * [135] 分发糖果
 */

// @lc code=start
class Solution {
    public int candy(int[] ratings) {
        int n = ratings.length;
        int[] left = new int[n];
        int[] right = new int[n];
        for(int i = 0; i < n; i++){
            if(i > 0 && ratings[i] > ratings[i - 1])
              left[i] = left[i - 1] + 1;
            else left[i] = 1;
        }
        int sum = 0;
        for(int i = n - 1; i >= 0; i--){
            if(i < n - 1 && ratings[i] > ratings[i + 1])
                right[i] = right[i + 1] + 1;
            else    right[i] = 1;
            sum += Math.max(right[i], left[i]);
        }
        return sum;
    }
}
// @lc code=end

