/*
 * @Author: your name
 * @Date: 2021-04-03 20:31:07
 * @LastEditTime: 2021-04-03 21:11:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\406.根据身高重建队列.java
 */
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

/*
 * @lc app=leetcode.cn id=406 lang=java
 *
 * [406] 根据身高重建队列
 */

// @lc code=start
class Solution {
    public int[][] reconstructQueue(int[][] people) {
        Arrays.sort(people, new Comparator<int[]>(){
            public int compare(int[] p1, int[] p2) {
                if (p1[0] == p2[0])
                //若身高相同则按K正向排序
                    return p1[1] - p2[1];
                //按身高反向排序
                else return p2[0] - p1[0];
            }
        });
        List<int[]> res = new ArrayList<>();
        for (int[] p : people) {
            res.add(p[1], p);
        }
        return res.toArray(new int[res.size()][]);
    }
}
// @lc code=end

