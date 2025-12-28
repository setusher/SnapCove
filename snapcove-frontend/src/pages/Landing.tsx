export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white grid grid-cols-1 lg:grid-cols-2">
      <div className="p-16 flex flex-col justify-center space-y-6">
        <h1 className="text-7xl font-bold">SnapCove</h1>
        <p className="text-gray-400 max-w-md">
          Your private home for event memories.
        </p>
        <button className="px-8 py-4 rounded-full bg-indigo-600 rounded-full">
          Get Started
        </button>
      </div>

      <div className="p-10 columns-2 gap-4 space-y-4">
        {[1,2,3,4,5,6].map(i=>(
          <img key={i}
            src={`https://picsum.photos/400/${500+i*10}`}
            className="rounded-3xl mb-4"
          />
        ))}
      </div>
    </div>
  )
}
