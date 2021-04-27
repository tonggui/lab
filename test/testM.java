/*
 * @Author: your name
 * @Date: 2021-03-28 13:41:17
 * @LastEditTime: 2021-04-18 19:59:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\test\testM.java
 */

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Scanner;
import java.util.Set;
//aabc子序列：有下列优美的子序列：””, ”a”, “a”, “b”, “c”, “ab”, “ab”, “bc”, “ac”, “ac”, “abc”, “abc”，一共12个。
public class testM{
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        int n,m;
        n = scan.nextInt();
        m = scan.nextInt();
        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = scan.nextInt();
        }
        System.out.println("");
    }
    public static void name() {
        
    }
    // public static void main(String[] args) {
    //     List<String> res = new ArrayList<>();
    //     Scanner scan = new Scanner(System.in);
    //     String s = scan.next();
    //     char[] c = s.toCharArray();
    //     process(c, 0,"",res);
    //     System.out.println(res.size()%20210101);
    // }
    // public static void  process(char[] c, int i, String tmp, List<String> res) {
    //     if (i == c.length){
    //         boolean flag = true;
    //         HashSet<Character> set = new HashSet<>();
    //         for (int j = 0; j < tmp.length(); j++) {
    //             if(set.contains(tmp.charAt(j))){
    //                 flag = false;
    //                 break;
    //             }else{
    //                 set.add(tmp.charAt(j));
    //             }
    //         }
    //         if (flag)   res.add(tmp);
    //         return;
    //     }
    //     process(c, i + 1, tmp, res);
    //     process(c, i + 1, tmp + c[i], res);
    // }
}
// public static void main(String[] args) {
//     Scanner sin = new Scanner(System.in);
//     String str = sin.next();
//     StringBuffer s = new StringBuffer(str);
//     int res = 0;
//     int idx = s.indexOf("ab");
//     while(idx != -1){
//        res++;
//        res  %= 1000000007;
//        s.replace(idx, idx + 2, "bba");
//        idx = s.indexOf("ab");
//     }
//     System.out.println(res);
// }
Scanner sin = new Scanner(System.in);
String[] str = sin.nextLine().split("");
int len = str.length;
int[] cost = new int[4];
if (str.length == 1){
    System.out.println(0);
    return;
}
cost[0] = 100;
cost[1] = 200;
cost[2] = 200;
cost[3] = 220;
int[][] dp = new int[100][100];
for (int j = 0; j < 4; j++) { 
    for (int i = j - 1; i >= 0; i--) {
        dp[i][j] = Integer.MAX_VALUE;
        if (str[i] == str[j]){
            dp[i][j] = dp[i+1][j-1];
        }else {
            dp[i][j] = Math.min(dp[i+1][j] + cost[Integer.parseInt(str[i])], dp[i][j - 1] + cost[Integer.parseInt(str[j])]);
        }
    }
}
System.out.println(dp[0][3]);