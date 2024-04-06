import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import router from '../router';

const service: AxiosInstance = axios.create({
    // baseURL: 'http://193.112.179.102:8081',
    baseURL: 'http://127.0.0.1:8081',
    timeout: 5000
});

// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 检查当前请求是否为登录请求
        if (!config.url.endsWith('/login')) {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                router.push('/login');
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        // console.log(error);
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        // 这里可以根据项目需要处理响应
        if (response.status === 200) {
            return response.data;
        }
        return response.data;
    },
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('jwt_token');
            router.push('/login');

        }
        if (error.response) {
            // 如果后端返回了错误信息
            const errMsg = error.response.data.message || '发生未知错误，请稍后再试';
            return Promise.reject(new Error(errMsg));
        } else {
            // 如果没有从后端得到错误信息
            return Promise.reject(new Error('网络错误，请检查您的网络连接是否正常'));
        }
    }
);

export default service;
