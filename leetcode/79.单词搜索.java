import org.graalvm.compiler.hotspot.nodes.aot.ResolveMethodAndLoadCountersNode;

/*
 * @Author: your name
 * @Date: 2021-03-13 11:23:47
 * @LastEditTime: 2021-03-13 15:59:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\79.单词搜索.java
 */
/*
 * @lc app=leetcode.cn id=79 lang=java
 *
 * [79] 单词搜索
 */

// @lc code=start
class Solution {
    public boolean exist(char[][] board, String word) {
        //bfs + 回溯
        //visited[][]标记是否遍历过
        int row = board.length, col = board[0].length;
        for (int i = 0; i < row; i++){
            for (int j = 0;j < col; j++){
                if (board[i][j] == word.charAt(0)) {
                    if (dfs(board, i, j,word,  0)) return true;
                }
            }
        }
        return false;
    }
    public static boolean dfs(char[][] board, int i, int j,String word, int k) {
        if(k == word.length())  return true;
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length)
            return false;
        if (word.charAt(k) != board[i][j])  return false;
        //在进回溯时把字符改成‘0’，出回溯再改回去，就不用额外存储是否访问了
        char t = board[i][j];
        //防止一个数被重复使用
        board[i][j] = '0';
        boolean res = dfs(board, i + 1, j, word, k + 1)||
        dfs(board, i, j + 1, word, k + 1) ||
        dfs(board, i - 1, j, word, k + 1) ||
        dfs(board, i, j - 1, word, k + 1);
        //不能为剩下字符找到路径，返回false，撤销当前点的访问状态，继续考察别的分支
        board[i][j] = t;
        return res;
    }
    public boolean exist2(char[][] board, String word) {
        //bfs
        //visited[][]标记是否遍历过
        int row = board.length, col = board[0].length;
        boolean[][] visited = new boolean[row][col];
        for (int i = 0; i < row; i++){
            for (int j = 0;j < col; j++){
                boolean flag = search(board, visited, i, j, word, 0);
                if(flag){
                   return true;
                }
            }
        }
        return false;
    }
    //search(i,j,k) 判断以网格的 (i, j)位置出发，
    //能否搜索到单词 {word}[k..]，其中{word}[k..]表示字符串{word}从第 k个字符开始的后缀子串。
    //如果能搜索到，则返回true，反之返回false。
    public static boolean search(char[][] board,boolean[][] visited,int i, int j,String word,int k) {
        if (board[i][j] != word.charAt(k)) return false;
        //找到就往上返回true---返回true的唯一条件：当前字符为字符串末尾
        else if(k == word.length() - 1)  return true;
        visited[i][j] = true;
        //顺着当前点往四个方向找
        int[][] directions = {{0, 1}, {0, -1}, {1, 0}, {-1, 0}};
        boolean res = false;
        for (int[] dir : directions){
            int newi = i + dir[0], newj = j + dir[1];
            if (newi >= 0 && newi < board.length && newj >= 0 && newj < board[0].length){
                //每次遍历相邻位置时，需要跳过已经被访问的位置。没有标记过,则访问
                if(!visited[newi][newj]){
        //每一个位置(i,j) 都调用函数check(i,j,0) 进行检查
        //只要有一处返回true，就说明网格中能够找到相应的单词，否则说明不能找到
                    boolean  flag = search(board, visited, newi, newj, word, k + 1);
                    if (flag){
                        res =  true;
                        break;
                    }
                }
            }
        }
        //返回之前标记为false
        visited[i][j] = false;
        return res;
    }
}
// @lc code=end

