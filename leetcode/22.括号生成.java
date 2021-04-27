/*
 * @Author: your name
 * @Date: 2021-02-22 18:47:36
 * @LastEditTime: 2021-03-18 20:44:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\22.括号生成.java
 */
import java.util.ArrayList;
import java.util.List;

/*
 * @lc app=leetcode.cn id=22 lang=java
 *
 * [22] 括号生成
 */

// @lc code=start
class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        // 特判
        if (n == 0) {
            return res;
        }
        // 执行深度优先遍历，搜索可能的结果
        dfs("",n,n,res);
        return res;
    }
     /**
     * @param path 当前递归得到的结果
     * @param left   左括号还有几个可以使用
     * @param right  右括号还有几个可以使用
     * @param res    结果集
     */
    public void dfs(String path, int left, int right, List<String> res) {
          // 因为每一次尝试，都使用新的字符串变量，所以无需回溯
        // 在递归终止的时候，直接把它添加到结果集即可，注意与「力扣」第 46 题、第 39 题区分
        if (left == 0 && right == 0) {
            res.add(path);
            return;
        }
         // 剪枝（左括号可以使用的个数严格大于右括号可以使用的个数，才剪枝，注意这个细节）
        //  right:右括号还有几个可以使用,left>right说明右括号使用多了
         if (left > right)   return;
        if (left > 0)   dfs(path + '(', left-1, right, res);
        if (right > 0)   dfs(path + ')', left, right - 1, res);
    }
    
    List[] cache;
    public List<String> generateParenthesis1(int n) {
        cache = new ArrayList[2 * n];
        return generate(n);
    }
    public List<String> generate(int n) {
        if (cache[n] != null)   return cache[n];
        ArrayList<String> res = new ArrayList<String>();
        if (n == 0) res.add("") ;
        else {
            StringBuffer sb = new StringBuffer(n * 2);
            for (int i = 0; i < n; i++) {
                List<String> left = generate(i);
                List<String> right = generate(n - 1 - i);
                for (String l : left){
                    for (String r : right) {
                        sb.setLength(0);
                        sb.append("(").append(l).append(")").append(r);
                        res.add(sb.toString());
                    }
                }
            }
        }
        cache[n] = res;
        return res;
    }
}
// @lc code=end

public class Solution {

    public List<List<Integer>> permute(int[] nums) {
        int len = nums.length;
        // 使用一个动态数组保存所有可能的全排列
        List<List<Integer>> res = new ArrayList<>();
        if (len == 0) {
            return res;
        }

        boolean[] used = new boolean[len];
        List<Integer> path = new ArrayList<>();

        dfs(nums, len, 0, path, used, res);
        return res;
    }

    private void dfs(int[] nums, int len, int depth,
                     List<Integer> path, boolean[] used,
                     List<List<Integer>> res) {
        if (depth == len) {
            res.add(new ArrayList<>(path));
            return;
        }
    // 在非叶子结点处，产生不同的分支，这一操作的语义是：在还未选择的数中依次选择一个元素作为下一个位置的元素，
    // 这显然得通过一个循环实现。
        for (int i = 0; i < len; i++) {
            if (!used[i]) {
                path.add(nums[i]);
                used[i] = true;

                dfs(nums, len, depth + 1, path, used, res);
        // 注意：下面这两行代码发生 「回溯」，回溯发生在从 深层结点 回到 浅层结点 的过程，
        // 代码在形式上和递归之前是对称的
                used[i] = false;
                path.remove(path.size() - 1);
            }
        }
    }
    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        Solution solution = new Solution();
        List<List<Integer>> lists = solution.permute(nums);
        System.out.println(lists);
    }