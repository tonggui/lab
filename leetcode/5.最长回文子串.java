/*
 * @Author: your name
 * @Date: 2021-03-15 08:22:08
 * @LastEditTime: 2021-03-28 10:33:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\5.最长回文子串.java
 */
/*
 * @lc app=leetcode.cn id=5 lang=java
 *
 * [5] 最长回文子串
 */

// @lc code=start
class Solution {
    public String longestPalindrome(String s) {
        int n = s.length();
        boolean[][] dp = new boolean[n][n];
        String res = "";
        for (int l = 0; l < n; l++){
            for (int i = 0; i + l < n; i++){
                int j = i + l;
                if (l == 0) dp[i][j] = true;
                else if (l == 1) dp[i][j] = (s.charAt(i) == s.charAt(j));
                else {
                    dp[i][j] =  (s.charAt(i) == s.charAt(j)) && dp[i + 1][j - 1];
                }
                if (dp[i][j] && l + 1 > res.length()){
                    res = s.substring(i, i + l + 1);
                }
            }
        }
        return res;
    }
}
// @lc code=end

