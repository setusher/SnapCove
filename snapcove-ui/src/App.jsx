import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './auth/ProtectedRoute'
import RoleGate from './auth/RoleGate'
import CreateEvent from './pages/CreateEvent'
import EventDetail from './pages/EventDetail'
import CreateAlbum from './pages/CreateAlbum'
import AlbumGallery from './pages/AlbumGallery'
import PhotoDetail from './pages/PhotoDetail'
import VerifyOTP from './pages/VerifyOTP'
import SelectRole from './pages/SelectRole'
import Profile from './pages/Profile'

function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }/>

      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }/>

      <Route path="/events/create" element={
        <ProtectedRoute>
          <RoleGate allow={["admin","coordinator"]}>
            <CreateEvent/>
          </RoleGate>
        </ProtectedRoute>
      }/>

      <Route path="/events/:eventId" element={<ProtectedRoute><EventDetail/></ProtectedRoute>} />
      <Route path="/events/:eventId/albums/create" element={<ProtectedRoute><CreateAlbum/></ProtectedRoute>} />
      <Route path="/events/:eventId/albums/:albumId" element={<ProtectedRoute><AlbumGallery/></ProtectedRoute>} />
      <Route path="/photos/:photoId" element={<ProtectedRoute><PhotoDetail/></ProtectedRoute>} />
      <Route path="/select-role" element={<ProtectedRoute><SelectRole/></ProtectedRoute>}/>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

export default App
