import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
})

api.interceptors.request.use((config)=>{
  const token = localStorage.getItem("access_token")
  if(token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res=>res,
  async err=>{
    if(err.response?.status === 401){
      const refresh = localStorage.getItem("refresh_token")
      if(refresh){
        const r = await axios.post("http://localhost:8000/api/auth/token/refresh/", { refresh })
        localStorage.setItem("access_token", r.data.access)
        err.config.headers.Authorization = `Bearer ${r.data.access}`
        return api.request(err.config)
      }
      localStorage.clear()
      window.location.href = "/login"
    }
    return Promise.reject(err)
  }
)
