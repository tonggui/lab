/*
 * @Author: your name
 * @Date: 2021-04-10 19:11:06
 * @LastEditTime: 2021-04-10 19:30:10
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \leetcode\96.不同的二叉搜索树.java
 */
/*
 * @lc app=leetcode.cn id=96 lang=java
 *
 * [96] 不同的二叉搜索树
 */

// @lc code=start
class Solution {
    public int numTrees(int n) {
        int[] G = new int[n + 1];
        G[0] = 1;
        G[1] = 1;
        for (int i = 2; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                G[i] += G[j - 1] * G[i - j];
            }
        }
        return G[n];
    }
}
// @lc code=end

