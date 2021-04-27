/*
 * @Author: your name
 * @Date: 2021-02-15 13:19:54
 * @LastEditTime: 2021-02-18 10:27:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\替换空格
 */
/*请实现一个函数，把字符串 s 中的每个空格替换成"%20"。
示例 1：
输入：s = "We are happy."
输出："We%20are%20happy."
限制：0 <= s 的长度 <= 10000
*/
class Solution{
    public String replaceSpace(String s) {
        StringBuilder sb = new StringBuilder();
        for(int i = 0; i < s.length(); i++){
            char ch = s.charAt(i);
            if(ch == ' '){
                sb.append("%20");
            }else{
                sb.append(ch);
            }
        }
        return sb.toString();
    }
}