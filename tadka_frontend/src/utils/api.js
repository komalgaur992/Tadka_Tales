import axios from 'axios'

// Base axios instance using CRA proxy (see package.json "proxy")
const api = axios.create({
  baseURL: '/',
  withCredentials: true, // allow cookies for dj-rest-auth if needed
})

// Attach Authorization header from localStorage if JWT present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tt_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Basic response interceptor to refresh tokens in future (placeholder)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // TODO: implement refresh flow using /api/auth/token/refresh/ if needed
    return Promise.reject(error)
  }
)

export default api
