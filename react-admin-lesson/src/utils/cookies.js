import cookies from "react-cookies";

const taskName = "taskName";
const taskRemark = "taskRemark";
const token = "adminToken";
const user = "username";

// 存储token
export function setTaskRemark(value){
    cookies.save(taskRemark, value);
}
export function getTasRemark(){
    return cookies.load(taskRemark);
}

// 存储用户名
export function setTaskName(value){
    cookies.save(taskName, value);
}
export function getTaskName(){
    return cookies.load(taskName);
}


// 存储token
export function setToken(value){
    cookies.save(token, value);
}
export function getToken(){
    return cookies.load(token);
}

// 存储用户名
export function setUsername(value){
    cookies.save(user, value);
}
export function getUsername(){
    return cookies.load(user);
}
