/*
 * @Author: your name
 * @Date: 2021-03-11 18:00:27
 * @LastEditTime: 2021-03-22 19:40:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\Offer45.java
 */
import java.util.ArrayList;
import java.util.List;

//剑指 Offer 45. 把数组排成最小的数
//输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。
//若字符串拼接 a + b > b + a，那么排序上 b < a;
public class Offer45 {
    public static String minNumber(int[] nums) {
        List<String> str = new ArrayList<>();
        for (int num : nums){
            str.add(String.valueOf(num));
        }
        str.sort((a,b)->(a+b).compareTo(b+a));
        StringBuilder sList = new StringBuilder();
        for (String s : str){
            sList.append(s);
        }
        return sList.toString();
    }
}
//
