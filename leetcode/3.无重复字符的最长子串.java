import java.util.HashMap;
import java.util.HashSet;

/*
 * @Author: your name
 * @Date: 2021-03-12 16:40:13
 * @LastEditTime: 2021-03-12 21:58:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\3.无重复字符的最长子串.java
 */
/*
 * @lc app=leetcode.cn id=3 lang=java
 *
 * [3] 无重复字符的最长子串
 */

// @lc code=start
class Solution {
    public int lengthOfLongestSubstring(String s) {
        HashMap<Character, Integer> map = new HashMap<>();
        int len = s.length();
        int l = 0,res = 0;
        for (int i = 0; i < len; i++){
            if (map.containsKey(s.charAt(i))){
                l = Math.max(l,map.get(s.charAt(i)));
            }
            map.put(s.charAt(i), i + 1);
            res = Math.max(res, i - l + 1);
        }
        return res;
    }
    public int lengthOfLongestSubstring2(String s) {
        //map中存当前字符和字符所在索引
        HashMap<Character, Integer> map = new HashMap<Character, Integer>();
        int len = s.length();
        int left = 0,res = 0;
        for (int i = 0; i < len; i++){
        /* 如果当前字符 ch 包含在 map中，此时有2类情况：
             1）当前字符包含在当前有效的子段中，如：abca，当我们遍历到第二个a，当前有效最长子段是 abc，我们又遍历到a，
             那么此时更新 left 为 map.get(a)+1=1，当前有效子段更新为 bca；
             2）当前字符不包含在当前最长有效子段中，如：abba，我们先添加a,b进map，此时left=0，我们再添加b，发现map中包含b，
             而且b包含在最长有效子段中，就是1）的情况，我们更新 left=map.get(b)+1=2，此时子段更新为 b，而且map中仍然包含a，map.get(a)=0；
             随后，我们遍历到a，发现a包含在map中，且map.get(a)=0，如果我们像1）一样处理，就会发现 left=map.get(a)+1=1，实际上，left此时
             应该不变，left始终为2，子段变成 ba才对。
             为了处理以上2类情况，我们每次更新left，left=Math.max(left , map.get(ch)+1).
             另外，更新left后，不管原来的 s.charAt(i) 是否在最长子段中，我们都要将 s.charAt(i) 的位置更新为当前的i，
        因此此时新的 s.charAt(i) 已经进入到 当前最长的子段中！*/
            if (map.containsKey(s.charAt(i))){
                left = Math.max(left, map.get(s.charAt(i)) + 1);
            }
        //没有出现重复的字符，左指针不需要变化。
    //此时不重复子串的长度为：i-left+1，与原来的maxLen比较，取最大值；
            map.put(s.charAt(i),i);//再更新map中a映射的下标
            res = Math.max(res, i - left + 1);
        }
        return res;
    }
    public int lengthOfLongestSubstring1(String s) {
        HashSet<Character> set = new HashSet<>();
        int len = s.length();
        //滑动窗口左右指针
    // 右指针，初始值为 -1，相当于我们在字符串的左边界的左侧，还没有开始移动
        int r = -1,res = 0;
        for (int i = 0; i < len; i++){
            if (i != 0){
                //左指针向右移动，移除一个字符
                set.remove(s.charAt(i - 1));
            }
            while (r + 1 < len && !set.contains(s.charAt(r + 1))){
                //不断右移右指针
                set.add(s.charAt(r + 1));
                ++r;
            }
            res = Math.max(res, r - i + 1);
        }
        return res;
    }
}
// @lc code=end

