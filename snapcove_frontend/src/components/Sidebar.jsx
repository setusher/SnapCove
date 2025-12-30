import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"

export default function Sidebar({ isOpen, onClose }) {
  const nav = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (path) => location.pathname === path

  const logout = () => {
    localStorage.clear()
    nav("/login")
  }

  const menuItems = [
    { icon: "🏠", label: "Dashboard", path: "/dashboard" },
    { icon: "📅", label: "Events", path: "/dashboard" },
  ]

  if (["admin", "coordinator"].includes(user?.role)) {
    menuItems.push({ icon: "➕", label: "Create Event", path: "/events/create" })
  }

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-300 flex items-center justify-center text-xl">
              📸
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Gallery</h1>
              <p className="text-xs text-gray-400">Event Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                nav(item.path)
                onClose()
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-300/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}>
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-300 flex items-center justify-center font-bold text-gray-900">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role || 'member'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20">
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}