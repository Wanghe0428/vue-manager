// 封装异步请求的方法

// 导入BASE_URL
import { BASE_URL } from "../config/index.js"
// 导入Nprogress ，加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
// 初始化一个axios对象
var instance = axios.create({
    // 设置接口地址根路径
    baseURL: BASE_URL,
    // 设置超时时间
    timeout: 10000,
    // 设置请求头
    headers: { 'token': sessionStorage.getItem('token') }
});

// 创建一个get请求方法
let get = async(url, params) => {
    // get ，post方法是axios实例自带的api，里面的url属性会自动与baseURL进行拼接
    // 因为在axios的get请求中，请求参数为一个对象，对象中包含了params属性
    let { data } = await instance.get(url, { params: params });
    return data;
};
// 创建一个post请求方法
let post = async(url, params) => {
    let { data } = await instance.post(url, params);
    return data
}

// 创建一个将token信息保存到请求头的方法
function setToken() {
    instance.defaults.headers.common['token'] = sessionStorage.getItem('token');
}

// 添加请求拦截器
instance.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    NProgress.start();
    return config;
}, function(error) {
    // 对请求错误做些什么
    // 关闭进度条
    NProgress.done();
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    // 进度条结束
    NProgress.done();
    return response;
}, function(error) {
    // 对响应错误做点什么
    // NProgress.done();
    return Promise.reject(error);
});

// 导出一个get和post方法
export {get, post, setToken }