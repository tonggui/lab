/*
 * @Author: your name
 * @Date: 2021-02-17 15:45:47
 * @LastEditTime: 2021-02-17 16:55:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\151.翻转字符串里的单词.java
 */
/*
 * @lc app=leetcode.cn id=151 lang=java
 *
 * [151] 翻转字符串里的单词
 */

// @lc code=start
class Solution {
    public String reverseWords2(String s) {
        String[] words = s.trim().split(" ");
        StringBuilder res = new StringBuilder();
        for(int i = words.length - 1; i>= 0; i--){
            //不能是equals(" ")
            if(words[i].equals("")) continue;
            res.append(words[i]+" ");
        }
        return (res.toString()).trim();
    }
    //双指针
    public String reverseWords(String s) {
        s = s.trim();
        int start = s.length() - 1, end = start;
        StringBuilder res = new StringBuilder();
        while (start >= 0){
            while (start >= 0 && s.charAt(start) != ' ') start--;
            res.append(s.substring(start + 1, end + 1) + " ");
            while (start >= 0 && s.charAt(start) == ' ') start--;
            end = start;
        }
        return (res.toString()).trim();
    }
}
// @lc code=end

