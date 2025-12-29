import { Link } from "react-router-dom"
import { Camera } from "lucide-react"

const demo = Array.from({length:5},(_,i)=>`/demo/${i+1}.jpg`)

const ratios = [
  "aspect-[3/4]","aspect-[4/3]","aspect-square",
  "aspect-[16/9]","aspect-[9/16]","aspect-[5/4]","aspect-[4/5]"
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">

      <header className="flex justify-center border-b border-gray-800 py-6">
        <div className="flex items-center gap-3">
          <Camera className="h-5 w-5"/>
          <span className="text-2xl font-bold tracking-tight">SnapCove</span>
        </div>
      </header>

      <main className="flex flex-col items-center text-center py-24 px-6">
        <h1 className="text-6xl font-extrabold mb-4">Your Event Memories, Perfectly Preserved</h1>
        <p className="text-gray-400 max-w-xl mb-8">
          A private gallery for your campus events — discover, relive and share every moment beautifully.
        </p>
        <div className="flex gap-4">
          <Link to="/signup" className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500">
            Get Started
          </Link>
          <Link to="/login" className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700">
            Login
          </Link>
        </div>
      </main>

      <section className="px-8 pb-24 max-w-7xl mx-auto">
  <div className="columns-2 md:columns-3 lg:columns-4 gap-6 [column-width:240px]">
    {demo.map((src,i)=>(
      <div
        key={i}
        className={`mb-6 overflow-hidden rounded-xl break-inside-avoid ${ratios[i%ratios.length]}`}
      >
        <img
          src={src}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
</section>

      <footer className="border-t border-gray-800 text-gray-500 text-center py-6 text-sm">
        © 2025 SnapCove
      </footer>

    </div>
  )
}
// nnnns