/*
 * @Author: your name
 * @Date: 2021-03-12 22:52:21
 * @LastEditTime: 2021-03-12 23:16:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\191.位-1-的个数.java
 */
/*
 * @lc app=leetcode.cn id=191 lang=java
 *
 * [191] 位1的个数
 */

// @lc code=start
public class Solution {
    // you need to treat n as an unsigned value
    public int hammingWeight(int n) {
        int count = 0;
        while (n != 0){
            int r =  n&(~n+1);
            count++;
            n ^= r;
        }
        return count;
    }
}
// @lc code=end

