/*
 * @Author: your name
 * @Date: 2021-02-18 09:00:26
 * @LastEditTime: 2021-02-18 09:10:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\翻转字符串.java
 */
class Solution {
    public String reverseLeftWords(String s, int n) {
        String res = "";
        int len = s.length();
        for(int i = n; i < len; i++){
            res += s.charAt(i);
        }
        for(int i = 0; i < n; i++){
            res += s.charAt(i);
        }
        return res;
    }
    public String reverseLeftWords2(String s, int n) {
        return s.substring(n, s.length())+s.substring(0, n);
    }
    public String reverseLeftWords3(String s, int n) {
        StringBuilder res = new StringBuilder();
        for(int i = n; i < s.length(); i++)
            res.append(s.charAt(i));
        for(int i = 0; i < n; i++)
            res.append(s.charAt(i));
        return res.toString();
    }
}
