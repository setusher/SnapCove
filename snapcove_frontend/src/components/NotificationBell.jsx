import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { api } from "../api/api"
import NotificationPanel from "./NotificationPanel"

export default function NotificationBell(){
  const [open,setOpen] = useState(false)
  const [count,setCount] = useState(0)

  useEffect(()=>{
    api.get("/notifications/unread-count/")
      .then(r=>setCount(r.data.count))
  },[])

  return (
    <div className="relative">
      <Bell onClick={()=>setOpen(!open)} className="cursor-pointer"/>

      {count>0 && (
        <span className="absolute -top-2 -right-2 bg-[#6fffe9] text-black text-xs px-2 rounded-full">
          {count}
        </span>
      )}

      {open && <NotificationPanel onClose={()=>setOpen(false)} refresh={()=>setCount(0)} />}
    </div>
  )
}
