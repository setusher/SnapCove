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

  // Mock photo data for masonry wall
  const mockPhotos = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    height: Math.random() * 200 + 200,
  }))

  return (
    <div className="min-h-screen bg-ink relative overflow-hidden animate-pageFade">
      {/* Deep navy gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-ink via-navy to-ink opacity-90"></div>
      
      {/* Ambient glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-aqua rounded-full blur-[120px] opacity-10"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-mint rounded-full blur-[140px] opacity-8"
          style={{ transform: `translate(${-scrollY * 0.08}px, ${-scrollY * 0.12}px)` }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-8 py-8 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-aqua to-mint flex items-center justify-center text-2xl shadow-glow-aqua">
              📸
            </div>
            <span className="text-card-title text-[#e8eaed] tracking-tight">SnapCove</span>
          </div>
          <button
            onClick={() => nav("/login")}
            className="btn btn-ghost px-6 py-3">
            Sign In
          </button>
        </header>

        {/* Hero Section - Magazine Spread */}
        <div className="max-w-[1600px] mx-auto px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[70vh]">
            {/* Left Side - Editorial Content */}
            <div className="space-y-12 animate-slideInLeft">
              <div className="inline-block">
                <span className="px-5 py-2.5 rounded-full bg-aqua/10 text-aqua text-sm font-medium border border-aqua/20 backdrop-blur-sm">
                  ✨ Premium Campus Event Platform
                </span>
              </div>
              
              <h1 className="text-hero text-[#e8eaed] leading-none tracking-tight">
                Capture Every
                <span className="block bg-gradient-to-r from-aqua via-mint to-aqua bg-clip-text text-transparent mt-2">
                  Moment That Matters
                </span>
              </h1>
              
              <p className="text-xl text-[#e8eaed]/70 max-w-xl leading-relaxed" style={{ letterSpacing: '-0.01em' }}>
                Professional event gallery management for photographers, coordinators, and teams. 
                Organize, share, and showcase your best work with cinematic elegance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => nav("/signup")}
                  className="btn btn-primary px-10 py-5 text-lg group relative overflow-hidden">
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-mint opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
                <button
                  onClick={() => nav("/login")}
                  className="btn btn-ghost px-10 py-5 text-lg">
                  Sign In
                </button>
              </div>
            </div>

            {/* Right Side - Animated Masonry Photo Wall */}
            <div className="relative h-[600px] lg:h-[700px] animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div 
                className="masonry-grid h-full parallax-container"
                style={{ transform: `translateY(${scrollY * 0.3}px)` }}
              >
                {mockPhotos.map((photo, i) => (
                  <div
                    key={photo.id}
                    className="masonry-item group relative"
                    style={{ 
                      height: `${photo.height}px`,
                      animationDelay: `${i * 0.05}s`
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-navy via-slate to-navy rounded-[24px] overflow-hidden relative">
                      {/* Placeholder gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-aqua/20 via-mint/10 to-aqua/20"></div>
                      
                      {/* Hover overlay */}
                      <div className="gradient-overlay"></div>
                      
                      {/* Floating caption */}
                      <div className="floating-caption">
                        <div className="bg-navy/80 backdrop-blur-md px-4 py-2 rounded-[12px] border border-aqua/20">
                          <p className="text-sm text-aqua font-medium">Event Photo {i + 1}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-32 pt-20 border-t border-slate/30">
            {[
              { icon: "🎯", title: "Organized Events", desc: "Create and manage unlimited events with editorial precision" },
              { icon: "📁", title: "Album Management", desc: "Organize photos into beautiful, cinematic collections" },
              { icon: "👥", title: "Team Collaboration", desc: "Work together with role-based access and permissions" }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="card p-8 stagger-item group hover:border-aqua/40"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-[20px] bg-aqua/10 border border-aqua/20 flex items-center justify-center text-3xl mb-6 group-hover:bg-aqua/20 group-hover:border-aqua/40 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-card-title text-[#e8eaed] mb-3">{feature.title}</h3>
                <p className="text-meta text-[#e8eaed]/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
