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
      case 'comment': return 'var(--accent)'
      case 'reply': return 'var(--accent)'
      case 'like': return '#ec4899'
      case 'upload': return 'var(--accent)'
      case 'approved': return '#22c55e'
      case 'rejected': return 'var(--error)'
      case 'tag': return '#3b82f6'
      default: return 'var(--secondary-text)'
    }
  }

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
      <div 
        style={{ 
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(0, 0, 0, 0.5)'
        }}
        onClick={onClose}
      />
      <div 
        ref={panelRef}
        className="flex-col"
        style={{
          position: 'fixed',
          right: 0,
          top: '64px',
          height: 'calc(100vh - 64px)',
          width: '480px',
          zIndex: 50,
          background: 'var(--secondary-bg)',
          borderLeft: '1px solid var(--border)',
          display: 'flex'
        }}
      >
        <div className="flex-between" style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 className="heading-md" style={{ marginBottom: 'var(--space-1)' }}>Notifications</h2>
            <p className="text-caption">Stay updated with system alerts and activity</p>
          </div>
          <button
            onClick={onClose}
            className="flex-center"
            style={{ width: '32px', height: '32px', color: 'var(--secondary-text)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-text)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--secondary-text)'}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex" style={{ justifyContent: 'flex-end', padding: 'var(--space-3) var(--space-6)', borderBottom: '1px solid var(--border)' }}>
          <button 
            onClick={markAll}
            className="text-caption"
            style={{ color: 'var(--accent)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Mark all as read
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <p className="text-body" style={{ color: 'var(--secondary-text)' }}>Loading...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <Bell size={64} style={{ color: 'var(--secondary-text)', margin: '0 auto var(--space-4)', opacity: 0.5 }} />
              <p className="heading-sm" style={{ marginBottom: 'var(--space-2)' }}>No new notifications</p>
              <p className="text-caption">You're all caught up!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {grouped.today.length > 0 && (
                <>
                  <div className="flex items-center" style={{ gap: 'var(--space-3)', margin: 'var(--space-8) 0 var(--space-4)' }}>
                    <span className="text-caption">Today</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                  </div>
                  {grouped.today.map(n => (
                    <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} getIcon={getNotificationIcon} getIconBg={getNotificationIconBg} />
                  ))}
                </>
              )}
              {grouped.yesterday.length > 0 && (
                <>
                  <div className="flex items-center" style={{ gap: 'var(--space-3)', margin: 'var(--space-8) 0 var(--space-4)' }}>
                    <span className="text-caption">Yesterday</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                  </div>
                  {grouped.yesterday.map(n => (
                    <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} getIcon={getNotificationIcon} getIconBg={getNotificationIconBg} />
                  ))}
                </>
              )}
              {grouped.thisWeek.length > 0 && (
                <>
                  <div className="flex items-center" style={{ gap: 'var(--space-3)', margin: 'var(--space-8) 0 var(--space-4)' }}>
                    <span className="text-caption">This Week</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                  </div>
                  {grouped.thisWeek.map(n => (
                    <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} getIcon={getNotificationIcon} getIconBg={getNotificationIconBg} />
                  ))}
                </>
              )}
              {grouped.older.length > 0 && (
                <>
                  <div className="flex items-center" style={{ gap: 'var(--space-3)', margin: 'var(--space-8) 0 var(--space-4)' }}>
                    <span className="text-caption">Older</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
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
      className="card"
      style={{
        cursor: 'pointer',
        background: isUnread ? 'rgba(99, 102, 241, 0.04)' : 'var(--secondary-bg)',
        borderLeft: isUnread ? '3px solid var(--accent)' : '1px solid var(--border)',
        padding: 'var(--space-5)',
        position: 'relative'
      }}
    >
      {isUnread && (
        <div 
          style={{
            position: 'absolute',
            left: '-7px',
            top: '24px',
            width: '10px',
            height: '10px',
            background: 'var(--accent)',
            borderRadius: '50%',
            border: '2px solid var(--secondary-bg)'
          }}
        />
      )}
      <div className="flex" style={{ gap: 'var(--space-4)' }}>
        <div 
          className="flex-center flex-shrink-0"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: iconBg,
            color: 'white'
          }}
        >
          {notification.actor_detail?.profile_picture ? (
            <img 
              src={notification.actor_detail.profile_picture} 
              alt={notification.actor_detail.name}
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            getIcon(notification.notification_type)
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="text-body" style={{ fontWeight: 500, marginBottom: 'var(--space-1)' }}>
            {notification.message}
          </div>
          {notification.photo_url && (
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <img 
                src={notification.photo_url} 
                alt="Photo"
                style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
              />
            </div>
          )}
          <div className="text-caption" style={{ marginTop: 'var(--space-2)' }}>
            {new Date(notification.created_at).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </div>
          {notification.photo && (
            <button
              className="btn btn-ghost"
              style={{ marginTop: 'var(--space-3)', padding: 'var(--space-2) var(--space-4)' }}
            >
              View Photos
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

