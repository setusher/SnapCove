import { useNavigate } from "react-router-dom"

export default function Landing() {
  const nav = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--primary-bg)' }}>
     
      <header className="flex-between" style={{ padding: 'var(--space-8) var(--space-12)' }}>
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <div 
            className="flex-center"
            style={{ 
              width: '32px',
              height: '32px',
              fontWeight: 600,
              fontSize: '18px',
              color: 'var(--accent)'
            }}
          >
            S
          </div>
          <span className="heading-md">SnapCove</span>
        </div>
        <button
          onClick={() => nav("/login")}
          className="btn btn-ghost"
        >
          Sign In
        </button>
      </header>

 
      <div className="container" style={{ paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto var(--space-16)' }}>
          <h1 className="heading-xl" style={{ marginBottom: 'var(--space-6)' }}>
            Campus Event Gallery
          </h1>
          <p className="text-body" style={{ color: 'var(--secondary-text)', marginBottom: 'var(--space-10)' }}>
            Organize, share, and preserve your campus events with a professional photo management platform.
          </p>
          <button
            onClick={() => nav("/signup")}
            className="btn btn-primary"
          >
            Get Started
          </button>
        </div>


        <div className="grid" style={{ 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 'var(--space-6)',
          marginTop: 'var(--space-12)'
        }}>
          {[
            { title: 'Organize Events', description: 'Create and manage event galleries with ease' },
            { title: 'Share Photos', description: 'Collaborative photo sharing for your community' },
            { title: 'Secure Storage', description: 'Reliable cloud storage for all your memories' }
          ].map((feature, idx) => (
            <div key={idx} className="card">
              <h3 className="heading-sm" style={{ marginBottom: 'var(--space-3)' }}>{feature.title}</h3>
              <p className="text-body" style={{ color: 'var(--secondary-text)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

