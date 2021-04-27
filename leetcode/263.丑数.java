/*
 * @Author: your name
 * @Date: 2021-04-10 17:48:22
 * @LastEditTime: 2021-04-10 18:04:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \leetcode\263.丑数.java
 */
/*
 * @lc app=leetcode.cn id=263 lang=java
 *
 * [263] 丑数
 */

// @lc code=start
class Solution {
    public boolean isUgly(int n) {
        if (n == 1) return true;
        if (n <= 0) return false;
        while (true) {
            if (n % 2 == 0){
                n /= 2;
            } else if (n % 3 == 0){
                n /= 3;
            } else if (n % 5 == 0){
                n /= 5;
            } else {
                if(n == 1){
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}
// @lc code=end

