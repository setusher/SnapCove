export default function TopNav({ title, subtitle, action }) {
  return (
    <div className="top-nav">
      <div>
        <h2 
          className="text-section mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p 
            className="text-meta"
            style={{ color: 'var(--text-secondary)' }}
          >
            {subtitle}
          </p>
        )}
      </div>
      
      {action && <div>{action}</div>}
    </div>
  )
}

