import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

/*
 * @Author: your name
 * @Date: 2021-04-03 14:27:53
 * @LastEditTime: 2021-04-09 17:59:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tttest\src\App.java
 */
public class App {
    public static void main(String[] args) {
        Scanner sin = new Scanner(System.in);
        String s;
        s = sin.next();
        String[] str = s.split(",");
        int[][] arrDate = new int[str.length][2];
        for(int i = 0; i < str.length; i++) {
            arrDate[i][0] = (int) str[i].charAt(0);
            arrDate[i][01] = (int) str[i].charAt(2);
        } 
        System.out.println(arrDate[1]);
    }
    public static void ss(String[] args) {
        // 输入
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int p = in.nextInt();
        int q = in.nextInt();
        // 把A想要的p块土地的序号丢到set里面
        Set<Integer> setA = new HashSet<>(p);
        for (int i = 0; i < p; i++) {
            setA.add(in.nextInt());
        }
        // B想要的q块存数组即可
        int[] B = new int[q];
        for (int i = 0; i < q; i++) {
            B[i] = in.nextInt();
        }
        
        // 两个国家共同想要的土地序号存在set里面
        Set<Integer> r = new HashSet<>();
        // 遍历B，如果setA里面也有，加入r里面
        for (int i = 0; i < q; i++) {
            if (setA.contains(B[i])) {
                r.add(B[i]);
            }
        }
        // 现在有两个国家共同想要的土地序号了，直接遍历计数即可
        int cA = 0;
        int cB = 0;
        // 遍历setA找A单独想要的土地序号
        for (int i : setA) {
            if (!r.contains(i)) {
                cA++;
            }
        }
        // 遍历B找到B到哪都想要的土地序号
        for (int i : B) {
            if (!r.contains(i)) {
                cB++;
            }
        }
        // 输出
        System.out.println(cA + " " + cB + " " + r.size());
    }
}
