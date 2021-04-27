/*
 * @Author: your name
 * @Date: 2021-04-19 08:50:59
 * @LastEditTime: 2021-04-19 09:03:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\389.找不同.java
 */
/*
 * @lc app=leetcode.cn id=389 lang=java
 *
 * [389] 找不同
 */

// @lc code=start
class Solution {
    public char findTheDifference(String s, String t) {
        char dif = t.charAt(0);
        int[] map = new int[26];
        for (int i = 0; i < s.length(); i++) {
            map[s.charAt(i) - 'a']--;
        }
        for (int i = 0; i < t.length(); i++) {
            map[t.charAt(i) - 'a']++;
        }
        for (int i = 0; i < map.length; i++) {
            if(map[i] == 1) {
                dif = (char)( i + 'a');
                break;
            }
        }
        return dif;
    }
}
// @lc code=end

