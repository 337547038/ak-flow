import axios from 'axios'

const service = axios.create({
  baseURL: '',
  // timeout: 30000, // request timeout
  headers: {}
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
