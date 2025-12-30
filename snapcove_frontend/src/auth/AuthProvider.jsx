import { createContext, useContext, useEffect, useState } from "react"
import { api } from "../api/api"

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    const token = localStorage.getItem("access_token")
    if(!token){
      setLoading(false)
      return
    }

    api.get("/auth/me/")
      .then(r=>setUser(r.data))
      .catch(()=>localStorage.clear())
      .finally(()=>setLoading(false))
  },[])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
