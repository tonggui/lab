import cookies from "react-cookies";

const taskName = "taskName";
const taskRemark = "taskRemark";
const token = "adminToken";
const user = "username";
const attackType = "attackType";
const whiteParams = "whiteParams";
const blackParams = "blackParams";
export function setTaskRemark(value){
    cookies.save(taskRemark, value);
}
export function getTaskRemark(){
    return cookies.load(taskRemark);
}
export function deleteTaskRemark(){
    return cookies.remove(taskRemark);
}
export function setTaskName(value){
    cookies.save(taskName, value);
}
export function getTaskName(){
    return cookies.load(taskName);
}
export function deleteTaskName(){
    return cookies.remove(taskName);
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

export function setAttackType(value){
    cookies.save(attackType, value);
}
export function getAttackType(){
    return cookies.load(attackType);
}
export function deleteAttackType(){
    return cookies.remove(attackType);
}

export function setBlackParams(value){
    cookies.save(blackParams, value);
}
export function getBlackParams(){
    return cookies.load(blackParams);
}
export function deleteBlackParams(){
    return cookies.remove(blackParams);
}

export function setWhiteParams(value){
    cookies.save(whiteParams, value);
}
export function getWhiteParams(){
    return cookies.load(whiteParams);
}
export function deleteWhiteParams(){
    return cookies.remove(whiteParams);
}
