/*
 * @Author: your name
 * @Date: 2021-04-04 07:24:53
 * @LastEditTime: 2021-04-04 07:42:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\200.岛屿数量.java
 */
/*
 * @lc app=leetcode.cn id=200 lang=java
 *
 * [200] 岛屿数量
 */

// @lc code=start
class Solution {
    public int numIslands(char[][] grid) {
        int row = grid.length, col = grid[0].length;
        int res = 0;
        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                if (grid[i][j] == '1') {
                    res++;
                    grid[i][j] = '0';
                    dfs(grid, i, j);
                }
            }
        }
        return res;
    }
    public void dfs(char[][] grid, int i, int j) {
        if(i >= grid.length || j >= grid[0].length) {
            return;
        }
        int[][] direction = new int[][]{{1,0}, {0, 1},{0,-1}, {-1, 0}};
        for (int[] dir : direction) {
            if((i + dir[0] >=0) && (i + dir[0] < grid.length) && 
            j +dir[1] >= 0 && (j +dir[1] < grid[0].length) &&
            grid[i + dir[0]][j + dir[1]] == '1') {
                grid[i + dir[0]][j + dir[1]] = '0';
                dfs(grid,i + dir[0] , j + dir[1]);
            }
        }
    }
}
// @lc code=end

