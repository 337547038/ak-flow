import request from '../utils/request'

const allApi: any = {
    getFlow:'./mock/data',
    getForm:'./mock/form',
}

export default (apiKey: string,
                id?: string) => {
    const url: string = `${allApi[apiKey] || apiKey}${id || ''}.json`
    return request({
        url: url,
        method: 'get'
    })
}