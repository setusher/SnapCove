export default function TopBar({ onMenuClick, title, subtitle, action }) {
    return (
      <div className="sticky top-0 z-30 bg-ink/60 backdrop-blur-xl border-b border-slate/10">
        <div className="px-12 lg:px-16 xl:px-20 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button
                onClick={onMenuClick}
                className="lg:hidden w-12 h-12 flex items-center justify-center rounded-[18px] hover:bg-navy/40 text-[#e8eaed]/60 hover:text-[#e8eaed] transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-section text-[#e8eaed] tracking-tight">{title}</h2>
                {subtitle && <p className="text-meta text-[#e8eaed]/50 mt-3">{subtitle}</p>}
              </div>
            </div>
            
            {action && <div>{action}</div>}
          </div>
        </div>
      </div>
    )
  }
