import axios from 'axios'
import {ElMessage} from 'element-plus';
import router from '../router'

axios.interceptors.response.use(success => {
    if (success.status && success.status == 200 && success.data.status == 500) {
        ElMessage.error({message: success.data.msg})
        return;
    }
    if (success.data.msg) {
        if(success.data.success){
            ElMessage.success({message: success.data.msg})
        } else {
            ElMessage.warning({message: success.data.msg})
        }
    }
    return success.data;
}, error => {
    console.log(error);
    if (error.response.status == 504 || error.response.status == 404) {
        ElMessage.error({message: '服务器被吃了( ╯□╰ )'})
    } else if (error.response.status == 403) {
        ElMessage.error({message: '权限不足，请联系管理员'})
    } else if (error.response.status == 401) {
        mymessage.error({message: error.response.data.msg ? error.response.data.msg : '尚未登录，请登录'})
        router.replace('/');
    } else {
        if (error.response.data.msg) {
            ElMessage.error({message: error.response.data.msg})
        } else {
            ElMessage.error({message: '未知错误!'})
        }
    }
    return;
})

let base = '';

export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    });
}

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}
export const putKeyValueRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        params: params
    })
}
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        params: params
    })
}
