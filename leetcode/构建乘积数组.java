/*
 * @Author: your name
 * @Date: 2021-02-18 09:36:36
 * @LastEditTime: 2021-02-18 10:19:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\构建乘积数组.java
 */
/*
给定一个数组 A[0,1,…,n-1]，请构建一个数组 B[0,1,…,n-1]，其中 B[i] 的值是数组 A 中除了下标 i 以外的元素的积, 即 B[i]=A[0]×A[1]×…×A[i-1]×A[i+1]×…×A[n-1]。不能使用除法。
    示例:
    输入: [1,2,3,4,5]
    输出: [120,60,40,30,24]
*/
public class SolutionArr {
    public int[] constructArr(int[] a) {
        int[] res = new int[a.length];
        int left = 1;
        for (int i = 0; i < a.length; i++){
            res[i] = left;
            left *= a[i];
        }
        int right = 1;
        for (int i = a.length - 1; i >= 0; i--){
            res[i] *=right;
            right *= a[i];
        }
        return res;
    }
}
