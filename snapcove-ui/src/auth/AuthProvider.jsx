import { createContext, useContext, useEffect, useState } from "react"
import { api } from "../api/api"

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user,setUser] = useState(null)
  const [loading,setLoading] = useState(true)

  const fetchUser = async () => {
    const token = localStorage.getItem("access_token")
    if(!token){ 
      setUser(null)
      setLoading(false)
      return 
    }

    try {
      const response = await api.get("/auth/me/")
      setUser(response.data)
    } catch(error) {
      localStorage.clear()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchUser()
  },[])

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, role: user?.role, setUser, refreshUser: fetchUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

