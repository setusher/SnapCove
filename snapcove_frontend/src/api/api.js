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
    res => res,
    async err => {
      const original = err.config
  
      // DO NOT REFRESH ON LOGIN OR SIGNUP
      if (
        original.url.includes("/auth/login") ||
        original.url.includes("/auth/signup")
      ) {
        return Promise.reject(err)
      }
  
      if (err.response?.status === 401 && !original._retry) {
        original._retry = true
        const refresh = localStorage.getItem("refresh_token")
        if (refresh) {
          try {
            const r = await axios.post("http://localhost:8000/api/auth/token/refresh/", { refresh })
            localStorage.setItem("access_token", r.data.access)
            original.headers.Authorization = `Bearer ${r.data.access}`
            return api(original)
          } catch {
            localStorage.clear()
            window.location.href = "/login"
          }
        }
      }
      return Promise.reject(err)
    }
  )
