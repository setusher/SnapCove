import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function Landing() {
  const nav = useNavigate()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Mock photos for masonry gallery
  const mockPhotos = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    height: Math.random() * 300 + 250,
  }))

  return (
    <div className="min-h-screen relative overflow-hidden animate-pageFade" style={{ background: 'var(--ink)' }}>
      {/* Deep gradient background */}
      <div 
        className="fixed inset-0"
        style={{
          background: 'linear-gradient(135deg, var(--ink) 0%, var(--navy) 50%, var(--ink) 100%)'
        }}
      />
      
      {/* Ambient glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-[140px] opacity-12"
          style={{
            background: 'var(--aqua)',
            transform: `translate(${scrollY * 0.12}px, ${scrollY * 0.18}px)`
          }}
        />
        <div 
          className="absolute bottom-1/4 -right-1/4 w-[1000px] h-[1000px] rounded-full blur-[160px] opacity-10"
          style={{
            background: 'var(--mint)',
            transform: `translate(${-scrollY * 0.1}px, ${-scrollY * 0.15}px)`
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Minimal Header */}
        <header className="px-8 lg:px-12 py-10 flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-[16px] flex items-center justify-center text-2xl shadow-glow"
              style={{
                background: 'linear-gradient(135deg, var(--aqua), var(--mint))',
                color: 'var(--ink)'
              }}
            >
              📸
            </div>
            <span className="text-card-title" style={{ color: 'var(--text-primary)' }}>SnapCove</span>
          </div>
          <button
            onClick={() => nav("/login")}
            className="btn btn-ghost"
          >
            Sign In
          </button>
        </header>

        {/* Hero Section */}
        <div className="max-w-[1800px] mx-auto px-8 lg:px-20 xl:px-24 py-16 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center min-h-[75vh]">
            
            {/* Left: Editorial Content */}
            <div className="space-y-12 animate-slideInLeft">
              <div className="inline-block">
                <span 
                  className="px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm"
                  style={{
                    background: 'rgba(93, 217, 193, 0.1)',
                    color: 'var(--aqua)',
                    border: '1px solid rgba(93, 217, 193, 0.2)'
                  }}
                >
                  ✨ Premium Campus Event Platform
                </span>
              </div>
              
              <div>
                <h1 
                  className="text-hero mb-6"
                  style={{ 
                    color: 'var(--text-primary)',
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  Capture Every
                </h1>
                <h1 
                  className="text-hero"
                  style={{
                    background: 'linear-gradient(135deg, var(--aqua), #7de5f0, var(--aqua))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  Moment That Matters
                </h1>
              </div>
              
              <p 
                className="text-xl max-w-[700px] mx-auto lg:mx-0"
                style={{ 
                  color: 'var(--text-secondary)',
                  lineHeight: '1.7',
                  opacity: 0.8
                }}
              >
                Professional event gallery management for photographers, coordinators, and teams. 
                Organize, share, and showcase your best work with cinematic elegance.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <button
                  onClick={() => nav("/signup")}
                  className="btn btn-primary text-lg px-10 py-5"
                  style={{
                    boxShadow: '0 4px 16px rgba(93, 217, 193, 0.3)'
                  }}
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => nav("/login")}
                  className="btn btn-ghost text-lg px-10 py-5"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Right: Animated Masonry Gallery */}
            <div 
              className="relative h-[600px] lg:h-[700px] animate-slideUp"
              style={{ animationDelay: '0.3s' }}
            >
              <div 
                className="masonry-grid h-full"
                style={{ transform: `translateY(${scrollY * 0.2}px)` }}
              >
                {mockPhotos.map((photo, i) => (
                  <div
                    key={photo.id}
                    className="masonry-item group relative stagger-item"
                    style={{ 
                      height: `${photo.height}px`,
                      animationDelay: `${i * 0.04}s`
                    }}
                  >
                    <div 
                      className="w-full h-full rounded-[12px] overflow-hidden relative"
                      style={{
                        background: `linear-gradient(135deg, 
                          rgba(26, 41, 66, 0.8) 0%, 
                          rgba(58, 80, 107, 0.6) 50%, 
                          rgba(26, 41, 66, 0.8) 100%)`
                      }}
                    >
                      {/* Gradient overlay */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, 
                            rgba(93, 217, 193, 0.15) 0%, 
                            rgba(111, 255, 233, 0.1) 50%, 
                            rgba(93, 217, 193, 0.15) 100%)`
                        }}
                      />
                      
                      {/* Hover overlay */}
                      <div className="gradient-overlay" />
                      
                      {/* Floating caption */}
                      <div className="floating-caption">
                        <div className="caption-chip">
                          <p 
                            className="text-sm font-medium"
                            style={{ color: 'var(--aqua)' }}
                          >
                            Event Photo {i + 1}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-32 pt-24" style={{ borderTop: '1px solid rgba(58, 80, 107, 0.3)' }}>
            {[
              { icon: "📁", title: "Organize", desc: "Create and manage unlimited events with precision" },
              { icon: "🔗", title: "Share", desc: "Easily share albums and photos with your team" },
              { icon: "✨", title: "Showcase", desc: "Present your best work in beautiful galleries" },
              { icon: "👥", title: "Collaborate", desc: "Work together with role-based permissions" }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="card p-8 stagger-item group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div 
                  className="w-16 h-16 rounded-[16px] flex items-center justify-center text-3xl mb-6 transition-all group-hover:scale-110"
                  style={{
                    background: 'rgba(93, 217, 193, 0.1)',
                    border: '1px solid rgba(93, 217, 193, 0.2)'
                  }}
                >
                  {feature.icon}
                </div>
                <h3 
                  className="text-card-title mb-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-meta leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
