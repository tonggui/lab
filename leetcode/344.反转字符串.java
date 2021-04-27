/*
 * @Author: your name
 * @Date: 2021-02-22 11:46:52
 * @LastEditTime: 2021-04-12 13:46:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\344.反转字符串.java
 */
/*
 * @lc app=leetcode.cn id=344 lang=java
 *
 * [344] 反转字符串
 */

// @lc code=start
class Solution {
    public void reverseString(char[] s) {
        int len = s.length;
        for (int i = 0; i < len/2; i++){
            swap(s, i, len - i - 1);
        }
    }
    public char[] swap(char[] s, int index1, int index2) {
        char tmp = s[index1];
        s[index1] = s[index2];
        s[index2] = tmp;
        return s;
    }
}
// @lc code=end

