/*
 * @Author: your name
 * @Date: 2021-02-21 11:12:32
 * @LastEditTime: 2021-02-21 14:15:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\队列的最大值.java
 */
import java.util.Deque;
import java.util.LinkedList;
import java.util.Queue;

class MaxQueue {
    private Queue<Integer> queue;
    private Deque<Integer> deque;
    public MaxQueue() {
        queue = new LinkedList<>();
        deque = new LinkedList<>();
    }
    
    public int max_value() {
        if(deque.isEmpty()) return -1;
        else  return deque.peek();
    }
    
    public void push_back(int value) {
        queue.offer(value);
        //maxQueue中队列的最后一个元素与当前值比较，保证队列单调递减
        while(!deque.isEmpty() && deque.peekLast() < value){
            deque.pollLast();
        }
        deque.offerLast(value);
    }
    
    public int pop_front() {
        if(queue.isEmpty()) return -1;
        int ans = queue.poll();
        if (ans == deque.peek()) deque.poll();
        return ans;
    }
}

/**
 * Your MaxQueue object will be instantiated and called as such:
 * MaxQueue obj = new MaxQueue();
 * int param_1 = obj.max_value();
 * obj.push_back(value);
 * int param_3 = obj.pop_front();
 */