import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Deque;
import java.util.LinkedList;

/*
 * @Author: your name
 * @Date: 2021-03-12 13:51:42
 * @LastEditTime: 2021-03-12 16:01:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\331.验证二叉树的前序序列化.java
 */
/*
 * @lc app=leetcode.cn id=331 lang=java
 *
 * [331] 验证二叉树的前序序列化
 */

// @lc code=start
class Solution {
    //扑克牌顺子
    public boolean isStraight(int[] nums) {
        if (nums.length > 5) return false;
        int count = 0;
        Arrays.sort(nums);
        for (int i = 0; i < nums.length; i++){
            if (nums[i] == 0){
                count ++;
                continue;
            }else if (i < nums.length - 1 && nums[i] == nums[i + 1])   return false;
        } 
        return nums[nums.length - 1] - nums[count] <= 5;
    }
    public boolean isValidSerialization(String preorder) {
        //stack
        int n = preorder.length();
        int i = 0;
        Deque<Integer> stack = new LinkedList<>();
        stack.push(1);
        while (i < n){
            if (stack.isEmpty()) return false;
            if(preorder.charAt(i) == ',')   i++;
            else if (preorder.charAt(i) == '#'){
                int top = stack.pop() - 1;
                if (top > 0)    stack.push(top);
                i++;
            }else {
                while (i < n && preorder.charAt(i) != ',')  i++;
                int top = stack.pop() - 1;
                if (top > 0)    stack.push(top);
                stack.push(2);
            }
        }
        return stack.isEmpty();
    }
    public boolean isValidSerialization2(String preorder) {
        if (preorder.charAt(0) == '#') return preorder.length() - 1 == 0;
        String[] str = preorder.split(",");
        int len = str.length - 1;
        //没遍历完节点，说明出度一直大于入度
        int outdegree = 0, indegree = 0;
        for(int i = 0; i <= len; i++){
            if (i == 0){
                if (str[i].equals("#"))  return false;
                else {
                    outdegree += 2;//根节点提供两个出度,0个入度
                    continue;
                }
            }
            if(str[i].equals("#")){
                indegree++;//为null时消耗一个入度
            }
            else {
                indegree++;
                outdegree += 2;
            }
            if (i < len && indegree >= outdegree) return false;
        }
        return indegree == outdegree;
    }
}
// @lc code=end

