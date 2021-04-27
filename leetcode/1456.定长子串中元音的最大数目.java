/*
 * @Author: your name
 * @Date: 2021-02-20 20:44:39
 * @LastEditTime: 2021-02-20 21:16:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\1456.定长子串中元音的最大数目.java
 */
import java.util.HashSet;

/*
 * @lc app=leetcode.cn id=1456 lang=java
 *
 * [1456] 定长子串中元音的最大数目
 */

// @lc code=start
class Solution {
    public int maxVowels(String s, int k) {
        if (s == null || s.length() == 0 || s.length() < k)
            return 0;
        int count = 0,res = 0;
        HashSet<Character> set = new HashSet<>();
        set.add('a');
        set.add('e');
        set.add('i');
        set.add('o');
        set.add('u');
        //先找第一个滑动窗口里面的元音个数
        for (int i = 0; i < k; i++){
            char in = s.charAt(i);
            if (set.contains(in))   count ++;
        }
        res = Math.max(res, count);
        for (int i = k; i < s.length(); i++){
            char out = s.charAt(i - k);
            char in = s.charAt(i);
            if (set.contains(out))   count --;
            if (set.contains(in))   count ++;
            res = Math.max(res, count);
        }
        return res;
    }
}
// @lc code=end

