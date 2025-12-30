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
        <header className="px-12 py-10 flex items-center justify-between max-w-[1800px] mx-auto">
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-[22px] flex items-center justify-center text-2xl shadow-glow"
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

        {/* Magazine Hero Spread */}
        <div className="max-w-[1800px] mx-auto px-12 lg:px-20 xl:px-24 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-24 lg:gap-40 items-center min-h-[80vh]">
            
            {/* Left: Editorial Content */}
            <div className="space-y-20 animate-slideInLeft">
              <div className="inline-block">
                <span 
                  className="px-8 py-4 rounded-full text-sm font-medium backdrop-blur-sm"
                  style={{
                    background: 'rgba(91, 192, 190, 0.1)',
                    color: 'var(--aqua)',
                    border: '1px solid rgba(91, 192, 190, 0.2)'
                  }}
                >
                  ✨ Premium Campus Event Platform
                </span>
              </div>
              
              <h1 className="text-hero" style={{ color: 'var(--text-primary)' }}>
                Capture Every
                <span 
                  className="block mt-6"
                  style={{
                    background: 'linear-gradient(135deg, var(--aqua), var(--mint), var(--aqua))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Moment That Matters
                </span>
              </h1>
              
              <p 
                className="text-xl leading-relaxed max-w-xl"
                style={{ 
                  color: 'var(--text-secondary)',
                  letterSpacing: '-0.01em',
                  lineHeight: '1.8'
                }}
              >
                Professional event gallery management for photographers, coordinators, and teams. 
                Organize, share, and showcase your best work with cinematic elegance.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 pt-8">
                <button
                  onClick={() => nav("/signup")}
                  className="btn btn-primary text-lg px-14 py-7 group relative overflow-hidden"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: 'var(--mint)' }}
                  />
                </button>
                <button
                  onClick={() => nav("/login")}
                  className="btn btn-ghost text-lg px-14 py-7"
                >
                  Sign In
                </button>
              </div>
            </div>

            {/* Right: Animated Masonry Gallery */}
            <div 
              className="relative h-[650px] lg:h-[750px] animate-slideUp"
              style={{ animationDelay: '0.3s' }}
            >
              <div 
                className="masonry-grid h-full parallax-container"
                style={{ transform: `translateY(${scrollY * 0.25}px)` }}
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
                      className="w-full h-full rounded-[28px] overflow-hidden relative"
                      style={{
                        background: `linear-gradient(135deg, 
                          rgba(28, 37, 65, 0.8) 0%, 
                          rgba(58, 80, 107, 0.6) 50%, 
                          rgba(28, 37, 65, 0.8) 100%)`
                      }}
                    >
                      {/* Gradient overlay */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(135deg, 
                            rgba(91, 192, 190, 0.15) 0%, 
                            rgba(111, 255, 233, 0.1) 50%, 
                            rgba(91, 192, 190, 0.15) 100%)`
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
          <div className="grid md:grid-cols-3 gap-12 mt-48 pt-32" style={{ borderTop: '1px solid rgba(58, 80, 107, 0.2)' }}>
            {[
              { icon: "🎯", title: "Organized Events", desc: "Create and manage unlimited events with editorial precision" },
              { icon: "📁", title: "Album Management", desc: "Organize photos into beautiful, cinematic collections" },
              { icon: "👥", title: "Team Collaboration", desc: "Work together with role-based access and permissions" }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="card p-12 stagger-item group"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div 
                  className="w-20 h-20 rounded-[24px] flex items-center justify-center text-4xl mb-10 transition-all group-hover:scale-110"
                  style={{
                    background: 'rgba(91, 192, 190, 0.1)',
                    border: '1px solid rgba(91, 192, 190, 0.2)'
                  }}
                >
                  {feature.icon}
                </div>
                <h3 
                  className="text-card-title mb-6"
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
