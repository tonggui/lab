/*
 * @Author: your name
 * @Date: 2021-02-16 10:42:12
 * @LastEditTime: 2021-02-16 14:19:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\169.多数元素.java
 */
import java.util.HashMap;
import java.util.Map;

/*
 * @lc app=leetcode.cn id=169 lang=java
 *
 * [169] 多数元素
 */

// @lc code=start
class Solution {
    public int majorityElement(int[] nums) {
        //摩尔投票法，初始化候选人及其出现次数，然后与数组剩余进行厮杀，若相同则次数+1，不同则减一
        //若次数减为0，则候选者为下一个，初始化次数为1
        //最终结果为留下来的candidate
        int candidate = nums[0],count = 1;
        for(int i = 1; i < nums.length; i++){
            if(candidate == nums[i]) count++;
            else{
                if(--count == 0){
                    candidate = nums[i];
                    count = 1;
                }
            }
        }
        return candidate;
    }
    public int majorityElement2(int[] nums) {
    /*
        遍历整个数组，对记录每个数值出现的次数(利用HashMap，其中key为数值，value为出现次数)；
    接着遍历HashMap中的每个Entry，寻找value值> nums.length / 2的key即可。
    */
        Map<Integer, Integer> counts = new HashMap<Integer, Integer>();
        for (int num : nums){
            if(!counts.containsKey(num))    counts.put(num, 1);
            else    counts.put(num, counts.get(num) + 1);
        }
        int limit = nums.length >> 1;
        //遍历Map,entrySet()的返回值也是返回一个Set集合，此集合的类型为Map.Entry。
        for (Map.Entry<Integer, Integer> entry : counts.entrySet()){
            if(entry.getValue()>limit)  return entry.getKey();
        }
        return -1;
    }
}
// @lc code=end

