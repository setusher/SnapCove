export default function TopBar({ onMenuClick, title, subtitle, action }) {
    return (
      <div className="sticky top-0 z-30 bg-navy/80 backdrop-blur-glass border-b border-slate/20 shadow-floating">
        <div className="px-8 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={onMenuClick}
                className="lg:hidden w-12 h-12 flex items-center justify-center rounded-[16px] hover:bg-navy/50 text-[#e8eaed]/60 hover:text-[#e8eaed] transition-all border border-transparent hover:border-slate/30">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-section text-[#e8eaed] tracking-tight">{title}</h2>
                {subtitle && <p className="text-meta text-[#e8eaed]/50 mt-2">{subtitle}</p>}
              </div>
            </div>
            
            {action && <div>{action}</div>}
          </div>
        </div>
      </div>
    )
  }
