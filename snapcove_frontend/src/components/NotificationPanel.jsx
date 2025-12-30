import { useEffect, useState } from "react"
import { api } from "../api/api"

export default function NotificationPanel({ onClose, refresh }){
  const [items,setItems] = useState([])

  useEffect(()=>{
    api.get("/notifications/")
      .then(r=>setItems(r.data))
  },[])

  const markAll = async()=>{
    await api.post("/notifications/read-all/")
    refresh()
    setItems(i=>i.map(n=>({...n,is_read:true})))
  }

  const mark = async(id)=>{
    await api.post(`/notifications/${id}/read/`)
    setItems(i=>i.map(n=>n.id===id?{...n,is_read:true}:n))
  }

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-[#1c2541]/90 backdrop-blur-xl p-6 shadow-2xl z-50 animate-slideIn">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <button onClick={markAll} className="text-[#6fffe9]">Mark all read</button>
      </div>

      <div className="space-y-4 overflow-y-auto h-full">
        {items.map(n=>(
          <div
            key={n.id}
            onClick={()=>mark(n.id)}
            className={`p-4 rounded-xl cursor-pointer transition ${n.is_read ? "opacity-60" : "bg-[#3a506b]/30"}`}
          >
            <p className="text-sm">{n.message}</p>
            <span className="text-xs opacity-50">{new Date(n.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
