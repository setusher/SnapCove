import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthProvider"

export default function ProtectedRoute({ children }) {
  const auth = useAuth()
  if (!auth || !auth.user) return <Navigate to="/login" />
  return children
}
