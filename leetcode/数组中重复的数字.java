import java.util.Arrays;
import java.util.HashSet;

public class findRepeatNumber {
    public int findRepeatNumber(int[] nums) {
        //先排序，然后遍历排完序的数组返回相同的值
        Arrays.sort(nums);
        int pre = nums[0];
        for (int i = 1; i < nums.length; i++){
            if(nums[i] == pre)  return pre;
            else    pre = nums[i];
        }
    }
    public int findRepeatNumber2(int[] nums) {
        HashSet<Integer> set = new HashSet<>();
        for (int num : nums){
            if(!set.add(num))   return  num;
        }
        return -1;
    }
}
/*
 * @Author: your name
 * @Date: 2021-02-21 17:27:41
 * @LastEditTime: 2021-02-21 17:27:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\数组中重复的数字.java
 */
