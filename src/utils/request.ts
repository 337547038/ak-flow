import axios from 'axios'
import {getUserInfo} from "./index";

const service = axios.create({
    baseURL: '',
    // timeout: 30000, // request timeout
    headers: {}
})

service.interceptors.request.use((config: any) => {
    config.headers['Authorization'] = getUserInfo()?.id || ""

    return config
})
service.interceptors.response.use(
    (res: any) => {2
        return res.data?.data
    },
    (error: any) => {
        return Promise.reject(error)
    }
)
export default service
