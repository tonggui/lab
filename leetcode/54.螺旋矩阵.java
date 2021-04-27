/*
 * @Author: your name
 * @Date: 2021-02-15 21:39:00
 * @LastEditTime: 2021-02-16 10:39:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\54.螺旋矩阵.java
 */
import java.util.ArrayList;
import java.util.List;

/*
 * @lc app=leetcode.cn id=54 lang=java
 *
 * [54] 螺旋矩阵
 */

// @lc code=start
class Solution {
    public List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> res = new ArrayList<>();
        if(matrix==null || matrix.length==0 || matrix[0].length == 0) return res;
        int top = 0, left = 0;
        int right = matrix[0].length-1,bottom = matrix.length-1;
        //转圈遍历，使用numEle（矩阵长度）来控制是否遍历完成
        int numEle = matrix.length * matrix[0].length;
        while(numEle>=1){
            for(int i = left; i <= right && numEle >= 1; i++){
                res.add(matrix[top][i]);
                numEle--;
            }
            top++;
            for(int i = top; i <= bottom && numEle >= 1; i++){
                res.add(matrix[i][right]);
                numEle--;
            }
            right--;
            for(int i = right; i >= left && numEle >= 1; i--){
                res.add(matrix[bottom][i]);
                numEle--;
            }
            bottom--;
            for(int i = bottom; i >= top && numEle >= 1; i--){
                res.add(matrix[i][left]);
                numEle--;
            }
            left++;
        }
        return res;
    }
    public List<Integer> spiralOrder2(int[][] matrix) {
        List<Integer> order = new ArrayList<Integer>();
        if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
            return order;
        }
        int rows = matrix.length, columns = matrix[0].length;
        boolean[][] visited = new boolean[rows][columns];
        int total = rows * columns;
        int row = 0, column = 0;
        int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};
        int directionIndex = 0;
        for (int i = 0; i < total; i++) {
            order.add(matrix[row][column]);
            visited[row][column] = true;
            int nextRow = row + directions[directionIndex][0], nextColumn = column + directions[directionIndex][1];
            if (nextRow < 0 || nextRow >= rows || nextColumn < 0 || nextColumn >= columns || visited[nextRow][nextColumn]) {
                directionIndex = (directionIndex + 1) % 4;
            }
            row += directions[directionIndex][0];
            column += directions[directionIndex][1];
        }
        return order;
    }
}
// @lc code=end

