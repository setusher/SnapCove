import { useNavigate } from "react-router-dom"

export default function Landing() {
  const nav = useNavigate()

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--primary-bg)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header 
        className="flex-between" 
        style={{ 
          padding: 'var(--space-6) var(--space-8)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky',
          top: 0,
          background: 'var(--primary-bg)',
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(10, 17, 40, 0.8)'
        }}
      >
        <div 
          className="flex-center" 
          style={{ gap: 'var(--space-2)' }}
        >
          <div 
            className="flex-center"
            style={{ 
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-button)',
              background: 'var(--surface)',
              border: '1px solid var(--border-subtle)',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--accent)',
              letterSpacing: '-0.5px'
            }}
          >
            S
          </div>
          <span 
            className="heading-md" 
            style={{ 
              fontWeight: 600,
              letterSpacing: '-0.3px'
            }}
          >
            SnapCove
          </span>
        </div>
        <button
          onClick={() => nav("/login")}
          className="btn btn-ghost"
          style={{ padding: '10px 20px' }}
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <section 
        className="landing-section landing-hero"
        style={{
          paddingTop: 'var(--space-20)',
          paddingBottom: 'var(--space-24)',
          paddingLeft: 'var(--space-6)',
          paddingRight: 'var(--space-6)',
          flex: 1,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div 
          className="container" 
          style={{ 
            textAlign: 'left',
            maxWidth: '900px',
            width: '100%'
          }}
        >
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-6)',
            letterSpacing: '-0.02em'
          }}>
            Your Campus Events,<br />But Actually Organized ✨
          </h1>
          
          <p style={{
            fontSize: 'clamp(18px, 2vw, 22px)',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'var(--secondary-text)',
            marginBottom: 'var(--space-6)',
            maxWidth: '800px'
          }}>
            Because "WhatsApp groups + Google Drive + Chaos" is not a system.
          </p>

          <p style={{
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            fontWeight: 400,
            lineHeight: 1.7,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-6)',
            maxWidth: '800px'
          }}>
            SnapCove keeps your fest photos, certificates, memories, and moments neatly organized — searchable, secure, and instantly shareable.
          </p>

          <p style={{
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            fontWeight: 400,
            lineHeight: 1.7,
            color: 'var(--secondary-text)',
            marginBottom: 'var(--space-6)',
            maxWidth: '800px'
          }}>
            No more lost photos. No more "bro send pics". No more folder nightmares.
          </p>

          <p style={{
            fontSize: 'clamp(18px, 2vw, 22px)',
            fontWeight: 500,
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-10)',
            maxWidth: '800px'
          }}>
            👉 One platform. Every event. Forever.
          </p>

          <button
            onClick={() => nav("/signup")}
            className="btn btn-primary"
            style={{
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 500
            }}
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  )
}
