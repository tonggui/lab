/*
 * @Author: your name
 * @Date: 2021-03-14 17:18:10
 * @LastEditTime: 2021-03-14 20:07:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\Offer47.java
 */
// 在一个 m*n 的棋盘的每一格都放有一个礼物，每个礼物都有一定的价值（价值大于 0）。
// 你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格、直到到达棋盘的右下角。
// 给定一个棋盘及其上面的礼物的价值，请计算你最多能拿到多少价值的礼物？

public class Offer47 {
    public int maxValue(int[][] grid) {
        int[][] dp = new int[grid.length][grid[0].length];
        dp[0][0] = grid[0][0];
        for (int i = 0; i < grid.length; i++) {
            for (int j = i; j < grid[0].length; j++) {
                if (i == 0 && j == 0)   continue;
                else if (i == 0) dp[i][j] = grid[i][j] + dp[i][j - 1];
                else if (j == 0) dp[i][j] = grid[i][j] + dp[i - 1][j];
                else dp[i][j] = grid[i][j] + Math.max(dp[i][j - 1], dp[i - 1][j]);
            }
        }
        return dp[grid[0].length - 1][grid[0].length - 1];
    }
    // public int dfs(int[][] grid,int[][] dp, int row, int col) {

    //     return Math.max(dfs)
    // }
}
/*
 * @Author: your name
 * @Date: 2021-03-14 17:18:10
 * @LastEditTime: 2021-03-14 17:18:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\Offer47.java
 */
