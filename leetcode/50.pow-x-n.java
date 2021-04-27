/*
 * @Author: your name
 * @Date: 2021-03-12 23:19:31
 * @LastEditTime: 2021-03-13 00:01:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\50.pow-x-n.java
 */
class Solution {
    //快速幂
    public double myPow(double x, int n) {
        long b = n;
        double res = 1.0;
        //如果是负数
        if (b < 0){
            x = 1 / x;
            b = -b;
        }
        while (b > 0){
            //判断二进制最右一位是否为 1
            if ((b & 1) == 1){
                res *= x;
            }
            x *= x;
            //n 右移一位；
            b >>= 1;
        }
        return res;
    }
}