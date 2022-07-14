import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    // baseURL: '/api',
    baseURL: process.env.VUE_APP_BASE_URL,
    // baseURL: process.env.VUE_APP_URL,
    timeout: 5000
});

//request 拦截器
//自请求发送前进行处理
service.interceptors.request.use(
    config => {
        config.headers['Content-Type'] = 'application/json;charset=utf-8';
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

//response 拦截器
//在接口响应后统一处理
service.interceptors.response.use(
    response => {
        let res = response.data;
        if (response.status === 200) {
            //如果返回的是文件
            if(response.config.responseType === 'blob') {
                return res;
            }
            //兼容返回的字符串数据
            if(typeof res === 'string') {
                res = res?JSON.parse(res) : res;
            }
            return res;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
