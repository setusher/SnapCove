import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import { MessageCircle, Heart, Upload, Reply, CheckCircle, XCircle, Tag, X, Bell } from "lucide-react"

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
      case 'comment': return <MessageCircle size={20} strokeWidth={1.5} />
      case 'reply': return <Reply size={20} strokeWidth={1.5} />
      case 'like': return <Heart size={20} strokeWidth={1.5} />
      case 'upload': return <Upload size={20} strokeWidth={1.5} />
      case 'approved': return <CheckCircle size={20} strokeWidth={1.5} />
      case 'rejected': return <XCircle size={20} strokeWidth={1.5} />
      case 'tag': return <Tag size={20} strokeWidth={1.5} />
      default: return <Bell size={20} strokeWidth={1.5} />
    }
  }

  const getNotificationIconBg = (type) => {
    switch(type) {
      case 'comment': return 'var(--accent-primary)'
      case 'reply': return 'var(--accent-primary)'
      case 'like': return '#ec4899'
      case 'upload': return 'var(--accent-secondary)'
      case 'approved': return '#22c55e'
      case 'rejected': return 'var(--error)'
      case 'tag': return '#3b82f6'
      default: return 'var(--text-tertiary)'
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

  // Group notifications by date
  const groupByDate = (notifications) => {
    const groups = { today: [], yesterday: [], thisWeek: [], older: [] }
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    notifications.forEach(n => {
      const date = new Date(n.created_at)
      if (date >= today) {
        groups.today.push(n)
      } else if (date >= yesterday) {
        groups.yesterday.push(n)
      } else if (date >= weekAgo) {
        groups.thisWeek.push(n)
      } else {
        groups.older.push(n)
      }
    })

    return groups
  }

  const grouped = groupByDate(items)

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
        className="fixed right-0 top-16 h-[calc(100vh-64px)] w-[480px] z-50 flex flex-col shadow-lg"
        style={{
          background: 'var(--bg-primary)',
          borderLeft: '1px solid var(--border-primary)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div>
            <h2 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)', lineHeight: '1.2' }}>
              Notifications
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Stay updated with system alerts and activity
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-tertiary)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Mark all read button */}
        <div className="px-6 py-3 border-b flex justify-end" style={{ borderColor: 'var(--border-primary)' }}>
          <button 
            onClick={markAll}
            className="text-sm transition-colors"
            style={{ color: 'var(--accent-primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Mark all as read
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>Loading...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 px-8" style={{ background: 'var(--bg-secondary)', borderRadius: '10px' }}>
              <Bell size={64} style={{ color: 'var(--border-primary)', margin: '0 auto 16px' }} />
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
                No new notifications
              </p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.today.length > 0 && (
                <>
                  <div className="flex items-center gap-3" style={{ margin: '32px 0 16px' }}>
                    <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                      Today
                    </span>
                    <div className="flex-1" style={{ height: '1px', background: 'var(--border-subtle)' }}></div>
                  </div>
                  {grouped.today.map(n => (
                    <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} getIcon={getNotificationIcon} getIconBg={getNotificationIconBg} />
                  ))}
                </>
              )}
              
              {grouped.yesterday.length > 0 && (
                <>
                  <div className="flex items-center gap-3" style={{ margin: '32px 0 16px' }}>
                    <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                      Yesterday
                    </span>
                    <div className="flex-1" style={{ height: '1px', background: 'var(--border-subtle)' }}></div>
                  </div>
                  {grouped.yesterday.map(n => (
                    <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} getIcon={getNotificationIcon} getIconBg={getNotificationIconBg} />
                  ))}
                </>
              )}
              
              {grouped.thisWeek.length > 0 && (
                <>
                  <div className="flex items-center gap-3" style={{ margin: '32px 0 16px' }}>
                    <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                      This Week
                    </span>
                    <div className="flex-1" style={{ height: '1px', background: 'var(--border-subtle)' }}></div>
                  </div>
                  {grouped.thisWeek.map(n => (
                    <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} getIcon={getNotificationIcon} getIconBg={getNotificationIconBg} />
                  ))}
                </>
              )}
              
              {grouped.older.length > 0 && (
                <>
                  <div className="flex items-center gap-3" style={{ margin: '32px 0 16px' }}>
                    <span className="text-xs font-semibold uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                      Older
                    </span>
                    <div className="flex-1" style={{ height: '1px', background: 'var(--border-subtle)' }}></div>
                  </div>
                  {grouped.older.map(n => (
                    <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} getIcon={getNotificationIcon} getIconBg={getNotificationIconBg} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function NotificationItem({ notification, onClick, getIcon, getIconBg }) {
  const isUnread = !notification.is_read
  const iconBg = getIconBg(notification.notification_type)

  return (
    <div
      onClick={() => onClick(notification)}
      className="cursor-pointer transition-all relative"
      style={{
        background: isUnread ? 'rgba(91, 192, 190, 0.04)' : 'var(--bg-primary)',
        border: '1px solid var(--border-primary)',
        borderLeft: isUnread ? '3px solid var(--accent-primary)' : '1px solid var(--border-primary)',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '12px',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-primary)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.06)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isUnread ? 'var(--accent-primary)' : 'var(--border-primary)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Unread dot indicator */}
      {isUnread && (
        <div 
          className="absolute"
          style={{
            left: '-7px',
            top: '24px',
            width: '10px',
            height: '10px',
            background: 'var(--accent-primary)',
            borderRadius: '50%',
            border: '2px solid var(--bg-primary)'
          }}
        />
      )}

      <div className="flex gap-4">
        {/* Avatar/Icon */}
        <div 
          className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            background: iconBg,
            color: 'var(--bg-primary)'
          }}
        >
          {notification.actor_detail?.profile_picture ? (
            <img 
              src={notification.actor_detail.profile_picture} 
              alt={notification.actor_detail.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            getIcon(notification.notification_type)
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-base font-medium mb-1.5" style={{ color: 'var(--text-primary)', lineHeight: '1.4' }}>
            {notification.message}
          </div>
          {notification.photo_url && (
            <div className="mb-2">
              <img 
                src={notification.photo_url} 
                alt="Photo"
                className="w-full h-20 object-cover rounded-md"
                style={{ border: '1px solid var(--border-primary)' }}
              />
            </div>
          )}
          <div className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
            {new Date(notification.created_at).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </div>
          {notification.photo && (
            <button
              className="mt-3 px-4 py-2 border rounded-md text-sm font-medium transition-all inline-flex items-center gap-1.5"
              style={{
                borderColor: 'var(--border-primary)',
                color: 'var(--text-tertiary)',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-secondary)'
                e.currentTarget.style.borderColor = 'var(--accent-primary)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'var(--border-primary)'
                e.currentTarget.style.color = 'var(--text-tertiary)'
              }}
            >
              View Photos
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
