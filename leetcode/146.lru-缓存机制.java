/*
 * @Author: your name
 * @Date: 2021-04-03 23:15:59
 * @LastEditTime: 2021-04-03 23:55:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\146.lru-缓存机制.java
 */
import java.util.HashMap;

/*
 * @lc app=leetcode.cn id=146 lang=java
 *
 * [146] LRU 缓存机制
 */

// @lc code=start

class LRUCache {
    class Node {
        public int key, val;
        public Node next, prev;
        public Node(int k, int v) {
            this.key = k;
            this.val = v;
        }
    }
    class DoubleList {
        Node head = new Node(0, 0);
        Node tail = new Node(0, 0);
        int size;
        private DoubleList() {
            head.next = tail;
            tail.prev = head;
            size = 0;
        }
        private void  addFirst(Node n) {
            Node headNext = head.next;
            head.next = n;
            headNext.prev = n;
            n.prev = head;
            n.next = headNext;
            size++;
        }
    
        private void remove(Node n) {
            n.prev.next = n.next;
            n.next.prev = n.prev;
            size--;
        }
        private Node removeLast() {
            Node last = tail.prev;
            remove(last);
            return last;
        }
        private int size() {
            return size;
        }
    }
    // key -> Node(key, val)
    private HashMap<Integer, Node> map;
    public DoubleList cache;
    private int cap;
    public LRUCache(int capacity) {
        this.cap = capacity;
        map = new HashMap<>();
        cache = new DoubleList();
    }
    
    public int get(int key) {
        if (!map.containsKey(key)) {
            return -1;
        }
        int val = map.get(key).val;
        put(key, val);// 利⽤ put ⽅法把该数据提前
        return val;
    }
    
    public void put(int key, int value) {
        Node n = new Node(key, value);
        if (map.containsKey(key)) {
            cache.remove(map.get(key));
            cache.addFirst(n);
            map.put(key, n);
        }else {
            if (cache.size() == cap) {
                Node last = cache.removeLast();
                map.remove(last.key);
            }
            cache.addFirst(n);
            map.put(key, n);
        }
    }
}




/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache obj = new LRUCache(capacity);
 * int param_1 = obj.get(key);
 * obj.put(key,value);
 */
// @lc code=end

