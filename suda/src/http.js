import axios from 'axios'

const http = axios.create({
    baseURL: 'http://localhost:3000/admin/api',
})

//给http请求加拦截器
http.interceptors.response.use(res => {
    return res
}, err => {
    const { status } = err.response;
    if (status == 401) {
        // 清除token
        window.localStorage.removeItem("WebToken");
        // 清除userId
        window.localStorage.removeItem("userId");
    }
    return Promise.reject(err);
})

// 添加请求拦截器，在发起请求时加上token请求头，因为用户信息接口要token
http.interceptors.request.use(
    (config) => {
        const WebToken = localStorage.getItem("WebToken");
        if (WebToken) {
            config.headers.Authorization = WebToken;
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);
export default http