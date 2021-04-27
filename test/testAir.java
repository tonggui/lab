import java.util.Arrays;
import java.util.Scanner;

/*
 * @Author: your name
 * @Date: 2021-04-04 13:43:37
 * @LastEditTime: 2021-04-18 21:47:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \test\testAir.java
 */

public class testAir {
        public static void main(String[] args) {
            Scanner in = new Scanner(System.in);
            int n = in.nextInt();
            int[] nums = new int[n];
            while (n > 0) {// 注意，如果输入是多个测试用例，请通过while循环处理多个测试用例
                nums[--n] = in.nextInt();
                
            }
            maxValue(n, nums);
        }
        public static void maxValue(int n, int[] nums) {
            int[] dp = new int[n];
            int maxN = 0;
            Arrays.sort(nums);
            for(int i = 0; i < n; i ++){
                dp[i] = 1;
                for (int j = i + 1; j < n; j++) {
                    int tmp = Math.max(nums[i], nums[j]) - Math.min(nums[i], nums[j]);
                    if(tmp > 1){
                        dp[i]++;
                    }
                }
                System.out.println(dp[i]);
                maxN = Math.max(maxN, dp[i]);
            }
            System.out.println(maxN);
        }
}
