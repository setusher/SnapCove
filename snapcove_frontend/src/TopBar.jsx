export default function TopBar({ onMenuClick, title, subtitle, action }) {
    return (
      <div className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onMenuClick}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
              </div>
            </div>
            
            {action && <div>{action}</div>}
          </div>
        </div>
      </div>
    )
  }