import java.util.ArrayList;
import java.util.List;

/*
 * @Author: your name
 * @Date: 2021-02-17 11:57:23
 * @LastEditTime: 2021-02-17 14:35:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\和为 s 的连续正数序列.java
 */
/*
输入一个正整数 target ，输出所有和为 target 的连续正整数序列（至少含有两个数）。
序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。
示例 1：
输入：target = 9
输出：[[2,3,4],[4,5]]
 */
class Solution {
    public int[][] findContinuousSequence(int target) {
        List<int[]> res = new ArrayList<>();
        int left = 1, right = 2;
        while(left < right){
            //# 等差数列求和公式求sum
            int sum = (left + right)*(right - left + 1) / 2;
            if(sum == target){
                int[] arr = new int[right - left + 1];
                for (int i = left; i <= right; i++)  arr[i - left] = i;
                res.add(arr);
                left++;
            }
            else if(sum < target)    right++;
            else    left++;
        }
        return res.toArray(new int[res.size()][]);
    }
}