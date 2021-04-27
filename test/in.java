import java.util.Arrays;
import java.util.Scanner;

/*
 * @Author: your name
 * @Date: 2021-03-28 11:24:19
 * @LastEditTime: 2021-03-28 12:21:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\test\in.java
 */
public class in{
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        //  while (in.hasNext()) { //注意while处理多个case  
        //     String a = in.nextLine();
        //     String b = in.nextLine();
        //     System.out.println(a + b);
        // }
        // while(in.hasNext()) {
        //     String[] strs = in.nextLine().split(" ");
        //     Arrays.sort(strs);
        //     // System.out.println(String.join(" ",s));
        //     String res = "";
        //     for(String s : strs)
        //         res += s + " ";
        //     System.out.println(res.trim());
        // }
        while(in.hasNext()){
            int n = in.nextInt();
            if (n == 0) {
                return;
            }
            int sum = 0;
            //while (n-- > 0){
            //    sum += input.nextInt();
            //}
            for (int i = 0; i < n; i++) {
                sum += in.nextInt();
            }
            System.out.println(sum);
        }
    }
} 