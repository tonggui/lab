/*
 * @Author: your name
 * @Date: 2021-03-14 16:29:49
 * @LastEditTime: 2021-03-14 16:42:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\Offer46.java
 */
public class Offer46 {
    //给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，
    //1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。
    public int translateNum(int num) {
        String s = String.valueOf(num);
        int[] dp = new int[s.length()];
        dp[0] = 1;
        for (int i = 1; i < s.length(); i++) {
            if (i + 1 < s.length() && s.charAt(i) - '0' !=0 
            &&(s.charAt(i) - '0')*10 + (s.charAt(i + 1) - '0') < 25){
                dp[i] = dp[i - 1] + 1;
            }else {
                dp[i] = dp[i - 1];
            }
        }
        return dp[s.length() - 1];
    }
}
