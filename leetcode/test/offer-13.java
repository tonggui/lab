/*
 * @Author: your name
 * @Date: 2021-03-13 16:02:02
 * @LastEditTime: 2021-04-26 10:40:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \react-admin-lessond:\lab\leetcode\test\offer-13.java
 */
// 1) automatically manage the memory that is really in use
// 2) only insert/remove elements from front/end, but can access/set elements with index
public class MyList<Integer>
{
    private int[] listArr;
    private int front;
    private int rear;
    private int capacity;
    public MyList(int initialCapacity)
    {
        listArr = new int[initialCapacity];
        this.front = 0;
        this.rear = 0;
        this.capacity = initialCapacity;
    }
    
    // average O(1) 
    public boolean AppendFirst(T element)
    {
        if((this.rear + 1) % capacity == 0){
            return false;
        }
        this.front = (front - 1 + capacity) % capacity;
        listArr[this.front] = element;
        return true;
    }
    
    // average O(1) 
    public boolean AppendEnd(T element)
    {
        if ((this.rear + 1 % capacity )== 0){
            return false;
        }
        listArr[rear++] = element;
        return true;
    }
    
    // average O(1) 
    public T RemoveFirst()
    {
        if(this.front == this.rear){
            throw new Exception();
        }
        int res = listArr[this.front++];
        return res;
    }
    
    // average O(1) 
    public T RemoveLast()
    {
        if(this.front == this.rear){
            throw new Exception();
        }
        int res = listArr[this.capacity--];
        return res;
    }
    
    // O(1)
    public int Count()
    {

    }
    
    // O(1)
    public void Set(int index, T element)
    {
        if(this.front == this.rear){
            throw new Exception();
        }
        int curIndex =this.front + index;
        listArr[curIndex] = element;
    }
    
    // O(1)
    public T Get(int index)
    {
        int curIndex =this.front + index;
        return listArr[curIndex];
}