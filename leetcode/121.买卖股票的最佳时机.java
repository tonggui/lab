/*
 * @Author: your name
 * @Date: 2021-03-14 21:53:19
 * @LastEditTime: 2021-03-14 23:33:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\121.买卖股票的最佳时机.java
 */
import java.util.Stack;

/*
 * @lc app=leetcode.cn id=121 lang=java
 *
 * [121] 买卖股票的最佳时机
 */

// @lc code=start
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length == 1 || prices.length == 0) return 0;
        int minCost = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int price : prices) {
            minCost = Math.min(minCost, price);
            //max(前 n-1 天的最大利润，第 n 天的价格 - 前 n 天的最低价格)
            maxProfit = Math.max(maxProfit, price - minCost);
        }
        return maxProfit;
    }
    public int maxProfit1(int[] prices) {
        if (prices.length == 1) return 0;
        Stack<Integer> stack = new Stack<>();
        int maxProfit = 0;
        stack.add(prices[0]);
        for (int i = 1; i < prices.length; i++) {
            //保证单调递减
            if (prices[i] < stack.peek())   stack.push(prices[i]);
            //进栈的值若大于栈顶元素，则能获得利润
            else    maxProfit = Math.max(maxProfit, prices[i] - stack.peek());
        } 
        return maxProfit;
    }
}
// @lc code=end

