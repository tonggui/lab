import java.util.ArrayList;
import java.util.List;

import jdk.internal.util.xml.impl.Input;

/*
 * @Author: your name
 * @Date: 2021-04-03 17:19:51
 * @LastEditTime: 2021-04-11 11:17:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\46.全排列.java
 */
/*
 * @lc app=leetcode.cn id=46 lang=java
 *
 * [46] 全排列
 */

// @lc code=start
class Solution {
    public List<List<Integer>> permutex(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        if (nums.length == 0)   return res;
        List<Integer> output = new ArrayList<Integer>();
        for (int num : nums) {
            output.add(num);
        }
        process(output, 0, res);
        return res;
    }

    public static void process(List<Integer> output, int i, List<List<Integer>> res) {
        if (i == output.size()) {
    // 参数传递是值传递，对象类型变量在传参的过程中，复制的是变量的地址。
            res.add(new ArrayList<>(output));
        }
    // 在非叶子结点处，产生不同的分支，这一操作的语义是：
    //在还未选择的数中依次选择一个元素作为下一个位置的元素，这显然得通过一个循环实现。
        for (int j = i; j < output.size(); j++) {
            swap(output, i, j);
            process(output, i + 1, res);
            swap(output, i, j);
        }
    }
    public static void swap(List<Integer> output, int i, int j) {
        int tmp = output.get(i);
        output.set(i,output.get(j));
        output.set(j, tmp);
    }
}
// @lc code=end

