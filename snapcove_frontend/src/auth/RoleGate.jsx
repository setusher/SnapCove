import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"

export default function RoleGate({ allow, children }) {
  const { user } = useAuth()
  if(!user) return <Navigate to="/login"/>
  if(!allow.includes(user.role)) return <Navigate to="/dashboard"/>
  return children
}
