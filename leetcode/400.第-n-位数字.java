/*
 * @Author: your name
 * @Date: 2021-03-13 08:58:27
 * @LastEditTime: 2021-03-13 11:20:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\400.第-n-位数字.java
 */
import java.lang.FdLibm.Pow;

/*
 * @lc app=leetcode.cn id=400 lang=java
 *
 * [400] 第 N 位数字
 */

// @lc code=start
class Solution {
    public int findNthDigit(int n) {
        //bit记录位数，p为记录所在的区间长度
        long bit = 1,p = 9;
        //目标数字n是三位数中的第n个数字。n=365时
        //n=365-9-90\times2=176n=365−9−90×2=176
        //bit= 3, n=176表示目标数字是三位数中的第 176个数字。
        while (n - bit * p > 0){
            n -= bit * p;
            bit++;
            p *= 10;
        }
        //设目标数字所在的数为 num, num=100+176/3=158
        //176/3代表的就是从100开始的第几个数，就是100加n取余就是当前得到的这个数的第几位
        long num = (int)Math.pow(10, bit-1) + (n - 1) / bit;
        //pos是答案所在数num中的位置(从左向右数)
        int pos = n % (int)bit;
        // n % bit == 0的时候，表示目标数字-1的最后一位数字
        //如果>0的话说明为目标数字的第几位，也就是索引+1。
        pos = pos == 0 ? (int)bit : pos;
        int t = (int)Math.pow(10, bit - pos);
        return (int)num / t % 10;
        // String s_num = String.valueOf(num);// 将该数字转为 string 类型
        // return s_num.charAt(pos)- '0';
    }
}
// @lc code=end

