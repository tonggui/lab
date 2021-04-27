import java.util.HashMap;
import java.util.Map;
import java.util.Stack;

/*
 * @lc app=leetcode.cn id=20 lang=java
 *
 * [20] 有效的括号
 */

// @lc code=start
class Solution {
    private static final Map<Character,Character> map = new HashMap<Character,Character>(){{
        put('{','}'); put('[',']'); put('(',')'); 
    }};

    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()){//如果为左括号,入栈
            if (map.containsKey(c))
                stack.push(c);
            else {
                if (!stack.isEmpty()){
                    //如果栈顶弹出的括号和此时的c不匹配直接返回false
                    if(map.get(stack.pop()) != c)
                        return false;
            }else {//此时栈为空,但却来了个右括号,也直接返回false
                return false;
            }
        }
    }
    //循环结束时,栈为空,就为有效括号
    return stack.isEmpty();
}
}
// @lc code=end

