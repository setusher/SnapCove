import { useNavigate } from "react-router-dom"

export default function Landing() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header className="px-12 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 flex items-center justify-center font-bold text-lg"
            style={{ color: 'var(--accent)' }}
          >
            S
          </div>
          <span className="text-section-title">SnapCove</span>
        </div>
        <button
          onClick={() => nav("/login")}
          className="btn btn-ghost"
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <div className="max-w-[1200px] mx-auto px-12 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-page-title mb-6">
            Campus Event Gallery
          </h1>
          <p className="text-body mb-10" style={{ color: 'var(--text-secondary)' }}>
            Organize, share, and preserve your campus events with a professional photo management platform.
          </p>
          <button
            onClick={() => nav("/signup")}
            className="btn btn-primary"
          >
            Get Started
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-3 gap-6 mt-24">
          {[
            { title: 'Organize Events', description: 'Create and manage event galleries with ease' },
            { title: 'Share Photos', description: 'Collaborative photo sharing for your community' },
            { title: 'Secure Storage', description: 'Reliable cloud storage for all your memories' }
          ].map((feature, idx) => (
            <div key={idx} className="card p-6">
              <h3 className="text-section-title mb-3">{feature.title}</h3>
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
