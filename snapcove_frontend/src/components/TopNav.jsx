export default function TopNav({ title, subtitle, action }) {
  return (
    <div className="top-nav">
      <div>
        <h2 
          className="text-2xl font-bold mb-2"
          style={{ 
            color: 'var(--text-primary)',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p 
            className="text-sm"
            style={{ 
              color: 'var(--text-secondary)',
              opacity: 0.7
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      
      {action && <div>{action}</div>}
    </div>
  )
}
