/*
 * @Author: your name
 * @Date: 2021-04-19 10:38:44
 * @LastEditTime: 2021-04-19 11:20:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\692.前k个高频单词.java
 */
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;

/*
 * @lc app=leetcode.cn id=692 lang=java
 *
 * [692] 前K个高频单词
 */

// @lc code=start
class Solution {
    
    public List<String> topKFrequent(String[] words, int k) {
        // key：字符串，value：出现的次数
       Map<String, Integer> count = new HashMap<>();
       for(String s : words) {
           count.put(s, count.getOrDefault(s, 0) + 1);
       }
       PriorityQueue<String> heap = new PriorityQueue<String>(
           (s1, s2)->count.get(s2).equals(count.get(s1))?
           s2.compareTo(s1) : count.get(s1) - count.get(s2)
           );
       for (String s : count.keySet()) {
           heap.offer(s);
           if (heap.size() > k) heap.poll();
       }
       List<String> res = new ArrayList<>();
       while (!heap.isEmpty())  {
           res.add(heap.poll());
       }
       Collections.reverse(res);
       return res;
   }

    public List<String> topKFrequent1(String[] words, int k) {
         // key：字符串，value：出现的次数
        Map<String, Integer> count = new HashMap<>();
        for(String s : words) {
            count.put(s, count.getOrDefault(s, 0) + 1);
        }
        // 传入 count.keySet() 对列表初始化
        List<String> res = new ArrayList<>(count.keySet());
        res.sort((s1,s2)->count.get(s1).equals(count.get(s2)) ?
         s1.compareTo(s2) : count.get(s2) - count.get(s1));
        return res.subList(0, k);
    }
}

// @lc code=end

