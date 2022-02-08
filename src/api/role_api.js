// 角色api层

// 导入get和post方法
import {get, post } from "../util/request.js"

// 查询角色类表信息
let List = async function() {
    let res = await get("/Role/List");
    return res;
}

// 添加角色信息
let add = async function(params) {
    return await post("/Role/Add", params);
}

//获取一个角色信息
let getOne = async function(params) {
    return await get("/Role/GetOne", params)
}

// 修改角色信息
let updata = async function(params) {
    return await post("/Role/Update", params)
}

// 删除角色信息
let del = async function(params) {
    return await post("/Role/delete", params);
}
export { List, add, getOne, updata, del }