import service from "../../src/utils/request";

/**
 * 创建任务接口 http://10.112.222.93:8000/black_attack/
 */
export function CreateWhiteTask(data){
    return service.request({
        url: "/white_attack/",
        method: "post",
        data, // 请求类型为 post 时
        // params: data // 请求类型为 get 时
    })
}

/**
 * 创建任务接口
 */
export function CreateBlackTask(data){
    return service.request({
        url: "/black_attack/",
        method: "post",
        data, // 请求类型为 post 时
        // params: data // 请求类型为 get 时
    })
}

/**
 * 白盒攻击全部
 */
export function WhiteAttacks(data){
    return service.request({
        url: "/show?type=white/",
        method: "get",
        params: data
    })
}

/**
 * 黑盒攻击全部
 */
export function BlackAttacks(data){
    return service.request({
        url: "/show?type=black/",
        method: "get",
        params: data
    })
}

/**
 * 详情
 */
export function WhiteDetailed(id){
    return service.request({
        url: `/white_attack_detail?id=${id}`,
        method: "get"
    })
}

/**
 * 黑盒详情
 */
export function BlackDetailed(id){
    return service.request({
        url: "/black_attack_detail?id=" + id,
        method: "get"
    })
}
