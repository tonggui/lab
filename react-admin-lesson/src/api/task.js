import service from "../../src/utils/request";
import axios from "axios";
import qs from "qs";


/**
 * 创建任务接口 http://10.112.222.93:8000/black_attack/
 */
// export function CreateWhiteTask(data){
//     return service.request({
//         url: "/white_attack/",
//         method: "post",
//         data, // 请求类型为 post 时
//         // params: data // 请求类型为 get 时
//     })
// }
export function CreateWhiteTask(data) {
    console.log(data)
    return new Promise((resolve, reject) => {
        axios({
            url: "/devApi/white_attack/",
            method: 'post',
            data:qs.stringify(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
/**
 * 创建任务接口
 */
export function CreateBlackTask(data){
    return new Promise((resolve, reject) => {
        axios({
            url: "/devApi/black_attack/",
            method: 'post',
            data
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * 攻击全部
 */

export function attackLists(data) {
    return new Promise((resolve, reject) => {
        axios({
            url: "/devApi/show/",
            method: 'post',
            data
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * 详情
 */
export function WhiteDetail(data){
    return new Promise((resolve, reject) => {
        axios({
            url: "/devApi/white_attack_detail/",
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data:qs.stringify(data)
        }).then(res => {
        console.log(res)
            resolve(res)
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

/**
 * 黑盒详情
 */
export function BlackDetail(data){
    return new Promise((resolve, reject) => {
        axios({
            url: "/devApi/black_attack_detail/",
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data:qs.stringify(data)
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
