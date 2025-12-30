import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import { MessageCircle, Heart, Upload, Reply, CheckCircle, XCircle, Tag, X } from "lucide-react"

export default function NotificationPanel({ onClose, refresh }){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const nav = useNavigate()
  const panelRef = useRef(null)

  useEffect(() => {
    api.get("/notifications/")
      .then(r => setItems(r.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const markAll = async () => {
    try {
      await api.post("/notifications/read-all/")
      setItems(items.map(n => ({ ...n, is_read: true })))
      if (refresh) refresh()
    } catch (err) {
      console.error(err)
    }
  }

  const mark = async (id) => {
    try {
      await api.post(`/notifications/${id}/read/`)
      setItems(items.map(n => n.id === id ? { ...n, is_read: true } : n))
      if (refresh) refresh()
    } catch (err) {
      console.error(err)
    }
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
      case 'comment': return <MessageCircle size={18} strokeWidth={1.5} />
      case 'reply': return <Reply size={18} strokeWidth={1.5} />
      case 'like': return <Heart size={18} strokeWidth={1.5} />
      case 'upload': return <Upload size={18} strokeWidth={1.5} />
      case 'approved': return <CheckCircle size={18} strokeWidth={1.5} />
      case 'rejected': return <XCircle size={18} strokeWidth={1.5} />
      case 'tag': return <Tag size={18} strokeWidth={1.5} />
      default: return <MessageCircle size={18} strokeWidth={1.5} />
    }
  }

  const getNotificationTypeLabel = (type) => {
    const labels = {
      'comment': 'Comment',
      'reply': 'Reply',
      'like': 'Like',
      'upload': 'Upload',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'tag': 'Tag'
    }
    return labels[type] || 'Notification'
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      />

      {/* Panel */}
      <div 
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-[420px] z-50 flex flex-col"
        style={{
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-section-title">Notifications</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={markAll}
              className="text-body text-sm transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>No notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className="p-4 cursor-pointer transition-colors"
                  style={{
                    background: n.is_read ? 'transparent' : 'rgba(91, 192, 190, 0.05)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = n.is_read ? 'transparent' : 'rgba(91, 192, 190, 0.05)'
                  }}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div 
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center"
                      style={{ color: 'var(--accent)' }}
                    >
                      {getNotificationIcon(n.notification_type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {n.actor_detail && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-body font-medium">
                            {n.actor_detail.name}
                          </span>
                          <span className="text-meta" style={{ color: 'var(--text-secondary)' }}>
                            {getNotificationTypeLabel(n.notification_type)}
                          </span>
                        </div>
                      )}

                      <p className="text-body mb-2" style={{ color: 'var(--text-primary)' }}>
                        {n.message}
                      </p>

                      {n.photo_url && (
                        <div className="mb-2">
                          <img 
                            src={n.photo_url} 
                            alt="Photo"
                            className="w-full h-20 object-cover"
                            style={{ border: '1px solid var(--border)' }}
                          />
                        </div>
                      )}

                      <span className="text-meta" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(n.created_at).toLocaleString()}
                      </span>
                    </div>

                    {/* Unread indicator */}
                    {!n.is_read && (
                      <div 
                        className="flex-shrink-0 w-2 h-2 rounded-full self-start mt-2"
                        style={{ background: 'var(--accent)' }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
