import request from '../utils/request'

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

export default (apiKey: string, data?: { [key: string]: any }) => {
    const url: string = `api/${allApi[apiKey] || apiKey}`
    return request({
        url: url,
        method: 'POST',
        data
    })
}


/*
export default (apiKey: string,
                id?: string) => {
    //const url: string = `${allApi[apiKey] || apiKey}${id || ''}.json`
    return request({
        url: apiKey,
        method: 'post',
        data:{query:{},extend:{}}
    })
}*/
