import axios from 'axios'
import 'element-plus/lib/theme-chalk/index.css'
import { ElMessage } from 'element-plus'

//创建axios的一个实例 
var instance = axios.create({
    baseURL:'http://localhost:8888/',//接口统一域名
    timeout: 6000                    //设置超时
})

instance.interceptors.request.use(config => {
    return config;
}, err => {
    ElMessage.error({ message: '请求超时!' });
    return Promise.resolve(err);
})
instance.interceptors.response.use(data => {
    if (data.status && data.status == 200 && data.data.status == 'error') {
        ElMessage.error({ message: data.data.msg });
        return;
    }
    return data;
}, err => {
    if (err.response.status == 504 || err.response.status == 404) {
        ElMessage.error({ message: '服务器被吃了⊙﹏⊙∥' });
    } else if (err.response.status == 403) {
        ElMessage.error({ message: '权限不足,请联系管理员!' });
    } else {
        ElMessage.error({ message: '未知错误!' });
    }
    // 当出错的时候我执行的是：Promise.resolve(err);，而不是Promise.reject(err);
    return Promise.resolve(err);
})

let base = 'http://localhost:8888';

export default function (method, url, data = null) {
    method = method.toLowerCase();
    if (method == 'post') {
        return instance.post(url, data)
    } else if (method == 'get') {
        return instance.get(url, { params: data })
    } else if (method == 'delete') {
        return instance.delete(url, { params: data })
    }else if(method == 'put'){
        return instance.put(url,data)
    }else{
        console.error('未知的method'+method)
        return false
    }
}

export const postRequest = (url, params) => {
    return instance({
        method: 'post',
        url: `${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const uploadFileRequest = (url, params) => {
    return instance({
        method: 'post',
        url: `${url}`,
        data: params,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
export const putRequest = (url, params) => {
    return instance({
        method: 'put',
        url: `${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = ''
            for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}
export const deleteRequest = (url) => {
    return instance({
        method: 'delete',
        url: `${url}`
    });
}
export const getRequest = (url) => {
    return instance({
        method: 'get',
        url: `${url}`
    });
}