import { useNavigate } from "react-router-dom"

export default function Landing() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-300 flex items-center justify-center text-xl">
              📸
            </div>
            <span className="font-bold text-xl text-white">Gallery</span>
          </div>
          <button
            onClick={() => nav("/login")}
            className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium backdrop-blur-sm border border-white/10">
            Sign In
          </button>
        </header>

        {/* Hero */}
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center animate-slideUp">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 text-sm font-medium border border-cyan-500/20">
                ✨ Event Management Platform
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Capture Every
              <span className="block bg-gradient-to-r from-cyan-400 to-emerald-300 bg-clip-text text-transparent">
                Moment That Matters
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Professional event gallery management for photographers, coordinators, and teams. Organize, share, and showcase your best work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => nav("/signup")}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-gray-900 font-semibold hover:shadow-2xl hover:shadow-cyan-500/50 transform hover:-translate-y-1 transition-all">
                Get Started Free
              </button>
              <button
                onClick={() => nav("/login")}
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm border border-white/10 transform hover:-translate-y-1 transition-all">
                Sign In
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-32">
            {[
              { icon: "🎯", title: "Organized Events", desc: "Create and manage unlimited events with ease" },
              { icon: "📁", title: "Album Management", desc: "Organize photos into beautiful albums" },
              { icon: "👥", title: "Team Collaboration", desc: "Work together with role-based access" }
            ].map((feature, i) => (
              <div key={i} className="stagger-item p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-400/20 flex items-center justify-center text-3xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}