/*
 * @Author: your name
 * @Date: 2021-03-26 16:30:10
 * @LastEditTime: 2021-03-26 16:41:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\240.搜索二维矩阵-ii.java
 */
/*
 * @lc app=leetcode.cn id=240 lang=java
 *
 * [240] 搜索二维矩阵 II
 */

// @lc code=start
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        if(matrix.length==0||matrix[0].length==0) return false;
        int row = 0;
        int col = matrix[0].length - 1;
        while (row < matrix.length && col >= 0){
            if (matrix[row][col] < target ){
               row++;
            }else if((matrix[row][col] > target ))  col--;
            else return true;
        }
        return false;
    }
}
// @lc code=end

