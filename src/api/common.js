import request from '../utils/request'

/**
 * POST 方法 与 GET方法  区别
 *
 * post==> data: obj
 * get==>params: obj
 *
 */
// 例如(post)：
export function updateBook(obj) {
    return request({
        url: '/book/update',      // url = base url + request url
        method: 'post',
        data: obj,    //----------------->>>区别
    })
}
// 例如(get)：
export function getBookList(obj) {
    return request({
        url: '/book/list',      // url = base url + request url
        method: 'post',
        params: obj,    //----------------->>>区别
    })
}
export function login(obj) {
    return request({
        url: '/doLogin',      // url = base url + request url
        method: 'post',
        params: obj,    //----------------->>>区别
    })
}