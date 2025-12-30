import { Link } from "react-router-dom"

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold mb-4">SnapCove</h1>
      <p className="text-gray-400 mb-8 max-w-xl">
        Your private home for campus event memories.
      </p>
      <div className="flex gap-4">
        <Link to="/signup" className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500">
          Get Started
        </Link>
        <Link to="/login" className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700">
          Login
        </Link>
      </div>
    </div>
  )
}
