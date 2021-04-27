/*
 * @Author: your name
 * @Date: 2021-03-12 16:01:56
 * @LastEditTime: 2021-03-12 16:37:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\8.字符串转换整数-atoi.java
 */
/*
 * @lc app=leetcode.cn id=8 lang=java
 *
 * [8] 字符串转换整数 (atoi)
 */

// @lc code=start
class Solution {
    //第一个for循环构造字符串，第二个while把字符串转换为整数
    public int myAtoi(String s) {
        if (s == null || s.length() == 0)   return 0;
        //提取符合的数,把符合要求的整数构造出来并存倒StringBuilder里
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++){
            char cur = s.charAt(i);
            if(cur == ' ' && sb.length() == 0) continue;
            else if ((cur == '+' || cur =='-') && sb.length() == 0)
                sb.append(cur);
            else if (cur >= 48 && cur <= 57)
                sb.append(cur);
            else break;
        }
        //当字符串构造不出来符合条件的整数时直接返回0
        if (sb.length() == 0) return 0;

        //把字符串例如"12345" 转换为整数 12345
        int res = 0;
        boolean flag = true;
        int i = 0;
        if (sb.charAt(0) == '+'){
            flag = true;
            i = 1;
        }else if(sb.charAt(0) == '-'){
            flag = false;
            i = 1;
        }

        while (i < sb.length()){
            int temp = sb.charAt(i) - '0';
            //这两个判断非常重要，如果溢出就直接返回
            //环境只能存储 32 位大小的有符号整数，因此，需要提前判：断乘以 10 以后是否越界
            if (flag == true && (res > Integer.MAX_VALUE / 10 
            || (res == Integer.MAX_VALUE / 10 && temp > 7))){
                return Integer.MAX_VALUE;
            }else if (flag == false && (res >Math.abs(Integer.MIN_VALUE / 10) 
            || (-res == Integer.MIN_VALUE / 10 && temp > 8)) ){
                return Integer.MIN_VALUE;
            }
            res = res *10 + temp;
            i++;
        }
        if (flag)   return res;
        else return res*-1;
    }
}
// @lc code=end

