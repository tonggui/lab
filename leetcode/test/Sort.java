package test;

import java.lang.reflect.Array;

/*
 * @Author: your name
 * @Date: 2021-02-28 09:43:52
 * @LastEditTime: 2021-03-02 22:56:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\sort\selectSort.java
 */
public class Sort {
    public static void main(String[] args) {
        int[] arr = {5, 1, 7, 3, 1, 6, 9, 4};
        // 包左不包右
        quickSort(arr, 0, arr.length);
        for (int i : arr) {
            System.out.print(i + "\t");
        }
    }
    public static void bubbleSort(int[] a) {
        for (int i = a.length - 1; i > 0; i--) {
            for (int j = 0; j < a.length - 1 - i; j++){
                if (a[j] > a[j + 1])    swap(a, j, j+1);
            }
        }
    }
    // public static void insertSort(int[] a) {
    //     for (int i = 1; i < a.length - 1; i++) {
    //         for (int j = i; j > 0 && a[j] < a[j - 1]; j--){
    //             swap(a, j, j-1);
    //         }
    //     }
    // }
    public static int[] insertSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int temp = arr[i];
            for (int j = i; j > 0 && temp < arr[j - 1]; j--) {
                arr[j] = arr[j - 1];
                arr[j - 1] = temp;
            }
        }
        return arr;
    }
    public static void shellSort(int[] arr) {
        //step:步长
        for (int step = arr.length / 2; step > 0; step /= 2){
             //对一个步长区间进行比较 [step,arr.length)
            for (int i = step; i < arr.length; i++) {
                int temp = arr[i];
                int j;
                //对步长区间中具体的元素进行比较
                for (j = i; j >= step && arr[j - step] > temp; j -= step) {
                    //j-step为左区间的取值，j为右区间与左区间的对应值。
                    arr[j] = arr[j - step];
                    arr[j - step] = temp;
                }
            }
        }
    }
    public static int partition(int[] arr, int low, int high) {
        int pivot = arr[low];// 基准值是第一个元素。
        int left = low; // 左指针指向最左侧。
        int right = high - 1; // 左指针指向最左侧,包左不包右。
        while (left < right) {
            //基准值是第一个元素时，一定是right先移
            // 若右指针大于基准值，则左移。
            while (left < right && arr[right] >= pivot){
                right--;
            }
            arr[left] = arr[right];// 直到arr[right]小于基准值，放到左边。
            // 若左指针小于基准值，则右移。
            while (left < right && arr[left] <= pivot){
                left++;
            }
            arr[right] = arr[left];// 直到arr[left]大于基准值，放到右边。
        }
        // 基准值放到正确位置。
        arr[left] = pivot;
        // 返回基准值的索引。
        return left;
    }
    public static void quickSort(int[] arr, int low, int high){
        // 只有一个元素的话，则什么都不做。
        if (high - low <= 1)    return;
        // 分区,拿到轴的位置
        int partition = partition(arr, low, high);
        // 递归左右两个分区。
        quickSort(arr, low, partition);
        quickSort(arr, partition + 1, high);
    }
    public static void swap(int[] a, int start, int end) {
        int temp = a[start];
        a[start] = a[end];
        a[end] = temp;
    }
}
