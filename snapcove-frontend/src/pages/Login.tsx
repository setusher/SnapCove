export default function Login(){
    return(
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-xl w-96 space-y-6">
          <h2 className="text-2xl font-bold">Login to SnapCove</h2>
          <input placeholder="Email" className="w-full p-3 rounded bg-black border border-gray-700"/>
          <input placeholder="Password" type="password" className="w-full p-3 rounded bg-black border border-gray-700"/>
          <button className="w-full p-3 bg-indigo-600 rounded hover:bg-indigo-500">Login</button>
        </div>
      </div>
    )
  }
  