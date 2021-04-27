/*
 * @Author: your name
 * @Date: 2021-04-25 22:46:44
 * @LastEditTime: 2021-04-26 00:01:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\91.解码方法.java
 */
/*
 * @lc app=leetcode.cn id=91 lang=java
 *
 * [91] 解码方法
 */

// @lc code=start
class Solution {
    public int numDecodings1(String s) {
        int len = s.length();
        //表示字符串s的前i个字符 s[1..i]的解码方法数
        int[] dp = new int[len + 1];
        //空字符串可以有1种解码方法，解码出一个空字符串
        dp[0] = 1;
        for(int i = 1; i <= len; i++) {
            // 使用一个字符,即s[i]进行解码
            if(s.charAt(i - 1) != '0'){
                dp[i] = dp[i - 1];
            }
            //使用两个字符,即s[i-1]和s[i]进行编码
            if(i > 1 && s.charAt(i - 2) != '0' && 
            (s.charAt(i - 2) - '0') * 10 + (s.charAt(i - 1) - '0') <= 26){
                dp[i] += dp[i - 2];
            }
        }
        return dp[len];
    }
    public int numDecodings(String s) {
        int n = s.length();
        // a = dp[i-2], b = dp[i-1], c=dp[i]
        int a = 0, b = 1, c = 0;
        for (int i = 1; i <= n; ++i) {
            c = 0;
            if (s.charAt(i - 1) != '0') {
                c += b;
            }
            if (i > 1 && s.charAt(i - 2) != '0' && ((s.charAt(i - 2) - '0') * 10 + (s.charAt(i - 1) - '0') <= 26)) {
                c += a;
            }
            a = b;
            b = c;
        }
        return c;
    }
}
// @lc code=end

