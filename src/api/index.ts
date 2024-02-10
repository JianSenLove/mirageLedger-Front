import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: 'https://www.fastmock.site/mock/dc695d037038802def4b989ba4650c3f/vms/getUser',
        method: 'post'
    });
};

// 登录请求
export const userLogin = (code: string, password: string) => {
    return request({
        url: 'http://127.0.0.1:8081/mirageLedger/user/login',
        method: 'post',
        data: {
            code,
            password
        }
    });
};

// 注册请求
export const register = (code: string, password: string, email: string) => {
    return request({
        url: 'http://127.0.0.1:8081/mirageLedger/user/register',
        method: 'post',
        data: {
            code,
            password,
            email
        }
    });
};
