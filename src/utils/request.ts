import axios from 'axios'

const service = axios.create({
    baseURL: '',
    // timeout: 30000, // request timeout
    headers: {}
})

service.interceptors.request.use((config: any) => {
    const userInfo = window.localStorage.getItem('userInfo')
    console.log("userInfo")
    console.log(userInfo)
    if (userInfo) {
        config.headers['Authorization'] = JSON.parse(userInfo).userId
    }

    return config
})
service.interceptors.response.use(
    (res: any) => {
        return res.data.data
    },
    (error: any) => {
        return Promise.reject(error)
    }
)
export default service
