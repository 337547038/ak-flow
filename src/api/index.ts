import request from '../utils/request'
import {getUserInfo} from "../utils";

const allApi: any = {
    saveDesignFlow: 'flow/design/save',
    getDesignFlow: 'flow/design/list',
    editDesignFlow: 'flow/design/edit',
    getDesignFlowById: 'flow/design/get',
    editDesignFlowDel: 'flow/design/delete',
    saveFlow: 'flow/save',
    getMy: 'flow/my',
    getCancel: 'flow/cancel',
    getFlowById: 'flow/get',
    getFlowRecord: 'flowRecord/list',
    getUserList: 'user/list',
    getTodoFlow: 'flow/todo',
    getDoneFlow: 'flowRecord/done',
    getCopyFlow: 'flowRecord/copy',
    getRecordById: 'flowRecord/get',
    submitApproval: "flow/approval"
}

// 使用后端接口时
/*export default (apiKey: string, data?: { [key: string]: any }) => {
    return request({
        url: `api/${allApi[apiKey] || apiKey}`,
        method: 'POST',
        data
    })
}*/

export default (apiKey: string, data?: { [key: string]: any }) => {
    const host = window.location.host
    // 使用json演示数据
    if (host.indexOf('github.com') !== -1 || host.indexOf('localhost') !== -1) {
        const id: string = data?.id || ''
        const includesApi = "flow/my,flow/todo,flowRecord/done,flowRecord/copy"
        let userId: string = "";
        if (includesApi.split(',').includes(allApi[apiKey] || apiKey)) {
            userId = getUserInfo().id;
        }
        return request({
            url: `mock/${allApi[apiKey] || apiKey}${userId}${id}.json`,
            method: 'get',
            data
        })
    } else {
        // 使用后端接口时
        return request({
            url: `api/${allApi[apiKey] || apiKey}`,
            method: 'POST',
            data
        })
    }

}
