/*
 * @Author: your name
 * @Date: 2021-02-21 17:54:47
 * @LastEditTime: 2021-02-21 18:33:58
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\第一个只出现一次的字符.java
 */
import java.util.HashMap;
import java.util.HashSet;

public class firstUniqChar {
    public char firstUniqChar(String s) {
        HashMap<Character, Boolean> map = new HashMap<>();
        for (int i = 0; i < s.length(); i++){
            if(!map.containsKey(s.charAt(i)) )   map.put(s.charAt(i), true);
            else    map.put(s.charAt(i), false);
        }
        for (int i = 0; i < s.length(); i++){
            if(map.get(s.charAt(i)))   return s.charAt(i);
        }
        return ' ';
    }
}
/*
 * @Author: your name
 * @Date: 2021-02-21 17:54:47
 * @LastEditTime: 2021-02-21 17:54:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\第一个只出现一次的字符.java
 */
