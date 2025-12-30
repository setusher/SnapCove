import { Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./auth/ProtectedRoute"
import CreateEvent from "./pages/CreateEvent"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard/>
      </ProtectedRoute>
      }/>
      <Route path="/events/create" element={
      <ProtectedRoute><CreateEvent/></ProtectedRoute>
      }/>
    </Routes>
  )
}
