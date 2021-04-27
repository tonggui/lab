import java.util.Arrays;

/*
 * @Author: your name
 * @Date: 2021-03-14 23:34:50
 * @LastEditTime: 2021-03-22 20:00:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\0ffer64.java
 */
public class offer64 {
    //求 1+2+...+n ，要求不能使用乘除法、for、while、if、else、switch、case等关键字及条件判断语句（A?B:C）。
    public int maxValue(int n,int[] arr) {
        if(n == 1)  return arr[0];
        int res = 0;
        res = maxValues(n,arr,0 ,arr.length);
        return res;
    }
    public int maxValues(int n,int[] arr, int left, int right){
        int count = arr.length;
        int res1 = 0 ,res2 = 0;
        int res = 0;
        while (count > 0){
            int mid = left + (right - left) >> 1;
            for (int i = 0; i < mid; i++) {
                res1 += arr[i];
                newArr1 = Arrays.copyOfRange(arr,  0 ,  mid );
            }
            for (int j = mid; j < arr.length; j++) {
                res2 += arr[j];
                newArr2 = Arrays.copyOfRange(arr,  mid ,  arr.length );
            }
            if (res1 >= res2) {
                res = res2;
            }else {
                res = res1;
            }
            count = arr.length - mid;
        }
        return res;
    }
}
