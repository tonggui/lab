import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/*
 * @Author: your name
 * @Date: 2021-03-11 18:33:01
 * @LastEditTime: 2021-03-28 16:29:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \test\offer.java
 */
//一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。
//在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字。

public class offer {
    // public static int solution(int[] A, int K) {
        // write your code in Java SE 8
    //     int res = Integer.MAX_VALUE;
    //     for (int i = 0; i <= A.length - K; i++){
    //         int[] B = new int[A.length - K];
    //         int j = 0;
    //         while (j < i){
    //             B[j] = A[j];
    //             j++;
    //         }
    //         while (j < A.length - K){
    //             B[j] = A[j + K]; 
    //             j++;
    //         }
    //         Arrays.sort(B);
    //         System.out.println("==");
    //         System.out.println(B[0]);
    //         System.out.println(B[B.length - 1]);
    //         res = Math.min(res, B[B.length - 1] - B[0]);
    //     }
    //     return res;
    // }
    public static int solution1(int[] A, int M) {
        if (A.length == 0){
            return 0;
        }
        Map<Integer,Integer> hm = new HashMap<Integer,Integer>();
        int min = A[0],max = A[0];
        for (int curA : A){
            if (min > curA){
                min = curA;
            }
            if (max < curA){
                max = curA;
            }
            hm.put(curA,hm.getOrDefault(curA, 0) + 1);
        }
        int res = 0,curSum = 0;
        for (int curA : A){
            if (!hm.containsKey(curA)){
                continue;
            }else{
                int i = curA;
                curSum = 0;
                while (i <= max){
                    if(hm.containsKey(i)){
                        curSum += hm.get(i);
                        hm.remove(i);
                    }
                    i += M;
                }
                while (i >= min){
                    if (hm.containsKey(i)){
                        curSum += hm.get(i);
                        hm.remove(i);
                    }
                    i -= M;
                }
                if (curSum > res){
                    res = curSum;
                }
            }
        }
        return res;
    }
    public static int solution(int[] A, int M) {
        // write your code in Java SE 8
        ArrayList<Integer> res = new ArrayList<>();
        int ans = Integer.MIN_VALUE;
        for (int i = 0; i < A.length; i++){
            res.add(A[i]);
            for (int j = 0; j < A.length; j++){
                if (j == i){
                    continue;
                }
                if ((A[i] - A[j]) % M == 0){
                    boolean flag = true;
                    for (int k = 0; k < res.size(); k++){
                        int t = res.get(k);
                        if ((A[i] - t) % M != 0){
                            flag = false;
                        }
                    }
                    if(flag)  res.add(A[j]);
                }
            }
            ans = Math.max(ans, res.size());
        }
        return ans;
    }
    public static void main(String[] args) {
        int[] arr = new int[]{-3,-2,1,0,8,7,1};
        int res = solution(arr,3);
        System.out.println(res);
    }

}
