import request from '../utils/py_request';

export const classifyAndAnalyseRemark = (data: any) => {
    return request.post('/RemarkClassifyAndAnalyse', data);
};