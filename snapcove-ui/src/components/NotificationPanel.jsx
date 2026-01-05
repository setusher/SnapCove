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
    // Navigate to photo if notification has a photo
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
      case 'rejected': return 'var(--danger)'
      case 'tag': return '#3b82f6'
      default: return 'var(--text-secondary)'
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
          top: '64px',
          zIndex: 40,
          background: 'rgba(0, 0, 0, 0.5)'
        }}
        onClick={onClose}
      />

     
      <div 
        ref={panelRef}
        style={{
          position: 'fixed',
          right: 0,
          top: '64px',
          height: 'calc(100vh - 64px)',
          width: '480px',
          zIndex: 50,
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.5)'
        }}
      >

        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Notifications
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Stay updated with system alerts and activity
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'color 200ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>


        <div style={{ 
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '12px 24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <button 
            onClick={markAll}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'text-decoration 200ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            Mark all as read
          </button>
        </div>


        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading...</p>
            </div>
          ) : items.length === 0 ? (
            <div style={{ 
              background: 'var(--surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              padding: '48px',
              textAlign: 'center'
            }}>
              <Bell size={64} style={{ color: 'var(--text-secondary)', margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                No new notifications
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                You're all caught up!
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {grouped.today.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '32px 0 16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>Today</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
                  </div>
                  {grouped.today.map(n => (
                    <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} getIcon={getNotificationIcon} getIconBg={getNotificationIconBg} />
                  ))}
                </>
              )}
              {grouped.yesterday.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '32px 0 16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>Yesterday</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
                  </div>
                  {grouped.yesterday.map(n => (
                    <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} getIcon={getNotificationIcon} getIconBg={getNotificationIconBg} />
                  ))}
                </>
              )}
              {grouped.thisWeek.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '32px 0 16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>This Week</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
                  </div>
                  {grouped.thisWeek.map(n => (
                    <NotificationItem key={n.id} notification={n} onClick={handleNotificationClick} getIcon={getNotificationIcon} getIconBg={getNotificationIconBg} />
                  ))}
                </>
              )}
              {grouped.older.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '32px 0 16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>Older</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}></div>
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
      onClick={() => notification.photo && onClick(notification)}
      style={{
        background: 'var(--surface)',
        border: isUnread ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
        borderLeft: isUnread ? '3px solid var(--accent)' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--card-padding)',
        cursor: notification.photo ? 'pointer' : 'default',
        transition: 'border-color 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        if (notification.photo) {
          e.currentTarget.style.borderColor = 'var(--accent)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isUnread ? 'var(--accent)' : 'var(--border-subtle)'
        e.currentTarget.style.borderLeft = isUnread ? '3px solid var(--accent)' : '1px solid var(--border-subtle)'
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
            border: '2px solid var(--surface)'
          }}
        />
      )}

      <div style={{ display: 'flex', gap: '16px' }}>

        <div 
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: iconBg,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
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
          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px', lineHeight: 1.5 }}>
            {notification.message}
          </div>
          {notification.photo_url && (
            <div style={{ marginBottom: '8px' }}>
              <img 
                src={notification.photo_url} 
                alt="Photo"
                style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-button)', border: '1px solid var(--border-subtle)' }}
              />
            </div>
          )}
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {new Date(notification.created_at).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
