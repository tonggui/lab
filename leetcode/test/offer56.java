/*
 * @Author: your name
 * @Date: 2021-03-13 01:11:11
 * @LastEditTime: 2021-03-13 01:18:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\test\offer56.java
 */
//整型数组 nums 里除两个数字之外，其他数字都出现了两次。
//请写程序找出这两个只出现一次的数字。要求时间复杂度是O(n)，空间复杂度是O(1)。

 
class Solution {
    public int[] singleNumbers(int[] nums) {
        int exo = 0;
        for (int i : nums){
            exo ^= i;
        }
        //exo = a ^ b
        int rightOne = exo & (~exo + 1);
        int one = 0;
        for (int num : nums){
            if ((num & rightOne) != 0){
                one ^= num;
            }
        }
        return new int[]{one,one ^ exo};
    }
}