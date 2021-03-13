import request from '../utils/request'

export const getList = ()=>{
    return request({
        url : "/admin/categoryTree",
        method : "get"
    })
}