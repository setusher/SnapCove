export default function TopBar({ title, subtitle, action }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0b132b]/60 border-b border-[#3a506b]/20">
      <div className="max-w-[1600px] mx-auto px-16 py-10 flex items-center justify-between">
        <div>
          <h1 className="text-[2.3rem] tracking-tight text-[#e8eaed]">{title}</h1>
          {subtitle && <p className="text-[#e8eaed]/50 mt-2">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  )
}
