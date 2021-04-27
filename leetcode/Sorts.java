/*
 * @Author: your name
 * @Date: 2021-02-28 14:38:43
 * @LastEditTime: 2021-04-09 20:20:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \leetcode\Sorts.java
 */
import java.util.Scanner;

public class Sorts {    
    public static void main(String[] args) {
        Scanner sin = new Scanner(System.in);
        int n = sin.nextInt();
        while(n>0) {
            int m = sin.nextInt();
            int[][] arr = new int[m][2];
            for(int i = 0; i < m; i++) {
                arr[i][0] = sin.nextInt();
                arr[i][1] = sin.nextInt();
            }
            int[] res = merge(arr);
            for(int i = 0; i < m; i++) {
                System.out.print(res[i]);
            }
            n--;
        }
    }

    public static int[] merge(int[][] arr) {
        int[] res = new int[arr.length];
        int start = 0;
        for(int i = 0; i < arr.length; i++) {
            System.out.println(start);
             if (start <= arr[i][0]){
                res[i] = arr[i][0];
                start = arr[i][0] + 1;
                continue;
             }else if(start <= arr[i][1]){
                start = arr[i][1] + 1;
             }else {res[i] = 0;}
        }
        return res;
    }

    private static void shellSort(int[] arr) {
        //step:步长
        for (int step = arr.length / 2; step > 0; step /= 2) {
            //对一个步长区间进行比较 [step,arr.length)
            for (int i = step; i < arr.length; i++) {
                int value = arr[i];
                int j;

                //对步长区间中具体的元素进行比较
                for (j = i - step; j >= 0 && arr[j] > value; j -= step) {
                    //j为左区间的取值，j+step为右区间与左区间的对应值。
                    arr[j + step] = arr[j]; 
                }
                //此时step为一个负数，[j + step]为左区间上的初始交换值
                arr[j + step] = value;  
            }
        }
    }
}