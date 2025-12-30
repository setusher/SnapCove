import { Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./auth/ProtectedRoute"
import CreateEvent from "./pages/CreateEvent"
import RoleGate from "./auth/RoleGate"
// import CreateEvent from "./pages/CreateEvent"
import EventDetail from "./pages/EventDetail"
import CreateAlbum from "./pages/CreateAlbum"
import AlbumGallery from "./pages/AlbumGallery"

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
        <ProtectedRoute>
          <RoleGate allow={["admin","coordinator"]}>
            <CreateEvent/>
          </RoleGate>
        </ProtectedRoute>
      }/>
      <Route path="/events/:id" element={<ProtectedRoute><EventDetail/></ProtectedRoute>} />
<Route path="/events/:id/albums/create" element={<ProtectedRoute><CreateAlbum/></ProtectedRoute>} />
<Route path="/events/:eventId/albums/:albumId" element={<ProtectedRoute><AlbumGallery/></ProtectedRoute>} />

    </Routes>
  )
}
