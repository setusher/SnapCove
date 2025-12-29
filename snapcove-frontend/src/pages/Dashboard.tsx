export default function Dashboard(){
    return(
      <div className="min-h-screen bg-black text-white p-10">
        <h1 className="text-4xl font-bold mb-8">My Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i=>(
            <div key={i} className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition">
              <h2 className="font-semibold mb-2">Event {i}</h2>
              <p className="text-gray-400 text-sm">120 Photos • 4 Photographers</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
  