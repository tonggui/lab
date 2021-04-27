/*
 * @Author: your name
 * @Date: 2021-04-04 07:51:07
 * @LastEditTime: 2021-04-09 23:41:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \leetcode\56.合并区间.java
 */
import java.util.Arrays;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

/*
 * @lc app=leetcode.cn id=56 lang=java
 *
 * [56] 合并区间
 */

// @lc code=start
class Solution {
    public static void main(String[] args) {
        Scanner sin = new Scanner(System.in);
        int n = sin.nextInt();
        while(n>0) {
            int m = sin.nextInt();
            int[][] arr = new int[m][2];
            for(int i = 0; i < m; i++) {
                arr[i][0] = sin.nextInt();
                arr[i][1] = sin.nextInt();
            }
            int[] res = merge(arr);
            for(int i = 0; i < m; i++) {
                System.out.print(res[i]);
            }
            n--;
        }
    }

    public static int[] merge(int[][] arr) {
        int[] res = new int[arr.length];
        int start = 0;
        for(int i = 0; i < arr.length; i--) {
             if (start <= arr[i][0]){
                res[i] = arr[i][0];
                start = arr[i][0] + 1;
                continue;
             }else if(start <= arr[i][1]){
                start = arr[i][1] + 1;
             }else res[i] = 0;
        }
        return res;
    }

    public static int[][] merge1(int[][] intervals) {
        int [][] res = new int[intervals.length][2];
        Arrays.sort(intervals, (n1, n2) -> n1[0] - n2[0]);
        int cur = -1;
        for (int[] interval : intervals) {
            if (cur == -1 || interval[0] > res[cur][1]) {
                res[++cur] = interval;
            }else {
                res[cur][1] = Math.max(res[cur][1], interval[1]);
            }
        }
        return Arrays.copyOf(res, cur + 1);
    }
    //主函数

}
// @lc code=end

