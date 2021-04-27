import java.util.ArrayDeque;
import java.util.Deque;

/*
 * @Author: your name
 * @Date: 2021-03-18 18:43:23
 * @LastEditTime: 2021-03-18 20:43:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\84.柱状图中最大的矩形.java
 */
/*
 * @lc app=leetcode.cn id=84 lang=java
 *
 * [84] 柱状图中最大的矩形
 */

// @lc code=start
class Solution {
    public int largestRectangleArea(int[] heights) {
        int len = heights.length;
        if (len == 0) {
            return 0;
        }
        if (len == 1) {
            return heights[0];
        }

        int area = 0;
        Deque<Integer> stack = new ArrayDeque<>();
        for (int i = 0; i < len; i++) {
            while (!stack.isEmpty() && heights[stack.peekLast()] > heights[i]){
                int height = heights[stack.removeLast()];

                while (!stack.isEmpty() &&  heights[stack.peekLast()] == height){
                    stack.removeLast();
                }

                int width;
                if (stack.isEmpty()){
                    width = i;
                } else {
                    width = i - stack.peekLast() - 1;
                }

                area = Math.max(area , width * height);
            }
            stack.addLast(i);
        }

        while (!stack.isEmpty()){
            int height = heights[stack.removeLast()];

            while (!stack.isEmpty() &&  heights[stack.peekLast()] == height){
                stack.removeLast();
            }

            int width;
            if (stack.isEmpty()){
                width = len;
            } else {
                width = len - stack.peekLast() - 1;
            }

            area = Math.max(area , width * height);
        }
        return area;
    }
    public int largestRectangleArea1(int[] heights) {
        //暴力解决
        int n = heights.length;
        int ans = 0;
         //枚举以当前heights[i]为高的所有矩形
        for (int i = 0; i < n; ++i) {
            int tmp = 0;
             //遍历前半部分，加上紧邻当前heights[i]的可用矩形面积
            for (int k = 0; k <= i; ++k) {
                if (heights[k] >= heights[i]) {
                    tmp += heights[i];
                }else {
                    tmp = 0;
                }
            }
            for (int j = i + 1; j < n; ++j) {
                if (heights[j] >= heights[i]) {
                    tmp += heights[i];
                } else {//因为遍历后半部分可以截断，所以前后部分遍历分开写了
                    break;
                }
            }
            ans = Math.max(ans, tmp);
        }
        return ans;
    }
    public int largestRectangleArea2(int[] heights) {
        int len = heights.length;
        // 特判
        if (len == 0) {
            return 0;
        }

        int res = 0;
        for (int i = 0; i < len; i++) {

            // 找左边最后 1 个大于等于 heights[i] 的下标
            int left = i;
            int curHeight = heights[i];
            while (left > 0 && heights[left - 1] >= curHeight) {
                left--;
            }

            // 找右边最后 1 个大于等于 heights[i] 的索引
            int right = i;
            while (right < len - 1 && heights[right + 1] >= curHeight) {
                right++;
            }

            int width = right - left + 1;
            res = Math.max(res, width * curHeight);
        }
        return res;
    }
}
// @lc code=end

