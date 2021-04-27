/*
 * @Author: your name
 * @Date: 2021-02-15 09:30:10
 * @LastEditTime: 2021-02-15 12:56:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\74.搜索二维矩阵.java
 */
/*
 * @lc app=leetcode.cn id=74 lang=java
 *
 * [74] 搜索二维矩阵
 */

// @lc code=start
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
       /* //二分查找
        if(matrix.length==0||matrix[0].length==0) return false;
        for (int i = 0; i<matrix.length; i++){
            //某一行的第一个元素大于了 target ，当前行和后边的所有行都不用考虑了，直接返回 false
            if(matrix[i][0]>target) break;
            //某一行的最后一个元素小于了 target ，当前行就不用考虑了，换下一行。
            if(matrix[i][matrix[i].length - 1] < target) continue;
            int col=binarySearch(matrix[i],target);
            if(col!=-1){
                return true;
            }
        }
        return false;*/
        if(matrix.length==0||matrix[0].length==0) return false;
        int row=0,col=matrix[0].length-1;
        while(row<matrix.length&&col>=0){
            if(target>matrix[row][col]) row++;
            else if(target<matrix[row][col]) col--;
            else return true;
        }
        return false;

    }
    public int binarySearch(int[] nums,int target) {
        int start = 0,end = nums.length-1;
        while(start<=end){
            int mid = (start+end)>>>1;
            if(nums[mid]==target)
                return mid;
            else if(nums[mid]<target)
                start = mid + 1;
            else
                end = mid - 1;
        }
        return -1;    
    }
}

// @lc code=end