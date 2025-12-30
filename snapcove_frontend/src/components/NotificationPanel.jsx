import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import { MessageCircle, Heart, Upload, Reply, CheckCircle, XCircle, Tag } from "lucide-react"

export default function NotificationPanel({ onClose, refresh }){
  const [items,setItems] = useState([])
  const nav = useNavigate()

  useEffect(()=>{
    api.get("/notifications/")
      .then(r=>setItems(r.data))
  },[])

  const markAll = async()=>{
    await api.post("/notifications/read-all/")
    refresh()
    setItems(i=>i.map(n=>({...n,is_read:true})))
  }

  const mark = async(id)=>{
    await api.post(`/notifications/${id}/read/`)
    setItems(i=>i.map(n=>n.id===id?{...n,is_read:true}:n))
  }

  const handleNotificationClick = async (notification) => {
    await mark(notification.id)
    if (notification.photo) {
      nav(`/photos/${notification.photo}`)
      onClose()
    }
  }

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'comment': return <MessageCircle size={18} />
      case 'reply': return <Reply size={18} />
      case 'like': return <Heart size={18} />
      case 'upload': return <Upload size={18} />
      case 'approved': return <CheckCircle size={18} />
      case 'rejected': return <XCircle size={18} />
      case 'tag': return <Tag size={18} />
      default: return <MessageCircle size={18} />
    }
  }

  const getNotificationTypeLabel = (type) => {
    switch(type) {
      case 'comment': return 'Comment'
      case 'reply': return 'Reply'
      case 'like': return 'Like'
      case 'upload': return 'Upload'
      case 'approved': return 'Approved'
      case 'rejected': return 'Rejected'
      case 'tag': return 'Tag'
      default: return 'Notification'
    }
  }

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-[#1c2541]/90 backdrop-blur-xl p-6 shadow-2xl z-50 animate-slideIn overflow-hidden flex flex-col" style={{ background: 'rgba(28, 37, 65, 0.95)' }}>
      <div className="flex justify-between mb-6 pb-4 border-b" style={{ borderColor: 'rgba(58, 80, 107, 0.3)' }}>
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</h2>
        <button 
          onClick={markAll} 
          className="text-sm font-medium transition-colors hover:underline"
          style={{ color: 'var(--aqua)' }}
        >
          Mark all read
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--text-secondary)' }}>No notifications yet</p>
          </div>
        ) : (
          items.map(n => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-4 rounded-[12px] cursor-pointer transition-all hover:scale-[1.02] ${
                n.is_read ? "opacity-60" : ""
              }`}
              style={{
                background: n.is_read ? 'rgba(58, 80, 107, 0.1)' : 'rgba(58, 80, 107, 0.3)',
                border: '1px solid rgba(58, 80, 107, 0.2)'
              }}
            >
              <div className="flex gap-3">
                {/* Icon */}
                <div 
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, var(--aqua), var(--mint))',
                    color: 'var(--ink)'
                  }}
                >
                  {getNotificationIcon(n.notification_type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Actor and Type */}
                  {n.actor_detail && (
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="font-semibold text-sm"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {n.actor_detail.name}
                      </span>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          background: 'rgba(93, 217, 193, 0.2)',
                          color: 'var(--aqua)'
                        }}
                      >
                        {getNotificationTypeLabel(n.notification_type)}
                      </span>
                    </div>
                  )}

                  {/* Message */}
                  <p 
                    className="text-sm mb-2 leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {n.message}
                  </p>

                  {/* Photo thumbnail if available */}
                  {n.photo_url && (
                    <div className="mb-2">
                      <img 
                        src={n.photo_url} 
                        alt="Photo"
                        className="w-full h-24 object-cover rounded-[8px]"
                        style={{ border: '1px solid rgba(58, 80, 107, 0.3)' }}
                      />
                    </div>
                  )}

                  {/* Timestamp */}
                  <span 
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Unread indicator */}
                {!n.is_read && (
                  <div 
                    className="flex-shrink-0 w-2 h-2 rounded-full self-start mt-2"
                    style={{ background: 'var(--mint)' }}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
