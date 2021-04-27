import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/*
 * @lc app=leetcode.cn id=139 lang=java
 *
 * [139] 单词拆分
 */

// @lc code=start
class Solution {
    private Map<String, Boolean> memo = new HashMap<>();
    public boolean wordBreak(String s, List<String> wordDict) {
        if (s.isBlank()) return true;
        return helper(s, wordDict);
    }
    //记忆回溯
    public boolean helper(String s, List<String> wordDict) {
        if (s.isBlank()) return true;
        if (memo.containsKey(s))    return memo.get(s);
        boolean res = false;
        for (String str : wordDict) {
            if (s.startsWith(str)){
                if (helper(s.substring(str.length(), s.length()), wordDict)){
                    res = true;
                    break;
                }
            }
        }
        memo.put(s, res);
        return res;
    }
    public boolean wordBreak1(String s, List<String> wordDict) {
        if (s.isBlank()) return true;
        Set<String> set = new HashSet(wordDict);
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        for (int i = 1; i <= s.length(); i++){
            for (int j = 0; j < i; j++) {
                if (dp[j] && set.contains(s.substring(j, i))){
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[s.length()];
    }
}
// @lc code=end

