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
        url: '/mirageLedger/user/login',
        method: 'post',
        data: {
            code,
            password
        }
    });
};

// 注册请求
export const register = (user: any) => {
    return request({
        url: '/mirageLedger/user/register',
        method: 'post',
        data: user
    });
};

// 用户详情
export const getUser = (id: string) => {
    return request({
        url: `/mirageLedger/user/${id}`,
        method: 'get'
    });
};

// 修改用户
export const updateUser = (id: string, form: any) => {
    return request({
        url: `/mirageLedger/user/${id}`,
        method: 'put',
        data: form
    });
};

// 删除用户
export const deleteUser = (id: string) => {
    return request({
        url: `/mirageLedger/user/${id}`,
        method: 'delete'
    });
};

// 用户列表
export const getUserPage = (query: any) => {
    return request({
        url: `/mirageLedger/user`,
        method: 'get',
        params: query
    });
};

// 新增课程
export const createCourse = (course: any) => {
    return request({
        url: '/mirageLedger/course',
        method: 'post',
        data: course
    });
};

// 课程详情
export const getCourse = (id: string) => {
    return request({
        url: `/mirageLedger/course/${id}`,
        method: 'get'
    });
};

// 修改课程
export const updateCourse = (id: string, course: any) => {
    return request({
        url: `/mirageLedger/course/${id}`,
        method: 'put',
        data: course
    });
};

// 删除课程
export const deleteCourse = (id: string) => {
    return request({
        url: `/mirageLedger/course/${id}`,
        method: 'delete'
    });
};

// 课程列表
export const getCoursePage = (query: any) => {
    return request({
        url: `/mirageLedger/course`,
        method: 'get',
        params: query
    });
};

// 新增课程评价
export const createCourseEvaluation = (evaluation: any) => {
    return request({
        url: `/mirageLedger/evaluation`,
        method: 'post',
        data: evaluation
    });
};

// 课程评价详情
export const getCourseEvaluation = (id: string) => {
    return request({
        url: `/mirageLedger/evaluation/${id}`,
        method: 'get'
    });
};

// 修改课程评价
export const updateCourseEvaluation = (id: string, evaluation: any) => {
    return request({
        url: `/mirageLedger/evaluation/${id}`,
        method: 'put',
        data: evaluation
    });
};

// 删除课程评价
export const deleteCourseEvaluation = (id: string) => {
    return request({
        url: `/mirageLedger/evaluation/${id}`,
        method: 'delete'
    });
};

// 课程评价列表
export const getCourseEvaluationPage = (queryParam: any) => {
    return request({
        url: `/mirageLedger/evaluation`,
        method: 'get',
        params: queryParam
    });
};

// 学生评论列表
export const getCourseCommentPage = (queryParam: any) => {
    return request({
        url: `/mirageLedger/comment`,
        method: 'get',
        params: queryParam
    });
};

// 新增学生评论
export const createCourseComment = (comment: any) => {
    return request({
        url: `/mirageLedger/comment`,
        method: 'post',
        data: comment
    });
};

// 修改学生评论
export const updateCourseComment = (id: string, comment: any) => {
    return request({
        url: `/mirageLedger/comment/${id}`,
        method: 'put',
        data: comment
    });
};

// 删除学生评论
export const deleteCourseComment = (id: string) => {
    return request({
        url: `/mirageLedger/comment/${id}`,
        method: 'delete',
    });
};
