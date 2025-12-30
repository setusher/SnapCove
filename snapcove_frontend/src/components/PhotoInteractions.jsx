import { useEffect, useState } from "react"
import { api } from "../api/api"
import { Heart, MessageCircle, Send } from "lucide-react"

export default function PhotoInteractions({ photo }) {
  const [comments,setComments] = useState([])
  const [liked,setLiked] = useState(photo.is_liked)
  const [text,setText] = useState("")

  useEffect(()=>{
    api.get(`/photos/${photo.id}/comments/`)
      .then(r=>setComments(r.data))
  },[photo.id])

  const toggleLike = async () => {
    const r = await api.post(`/photos/${photo.id}/like/`)
    setLiked(r.data.liked)
  }

  const send = async () => {
    if(!text.trim()) return
    const r = await api.post(`/photos/${photo.id}/comments/`,{ content:text })
    setComments([r.data,...comments])
    setText("")
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Heart 
          onClick={toggleLike}
          className={`cursor-pointer transition ${liked ? "fill-[#6fffe9] text-[#6fffe9]" : "text-slate-400 hover:text-[#6fffe9]"}`}
        />
        <MessageCircle className="text-slate-400"/>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {comments.map(c=>(
          <div key={c.id}>
            <p className="text-sm"><b>{c.user.name}</b> {c.content}</p>
            {c.replies.map(r=>(
              <p key={r.id} className="ml-4 text-xs text-slate-400">
                ↳ {r.user.name}: {r.content}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-black/40 rounded-xl px-4 py-2 outline-none"
        />
        <button onClick={send} className="text-[#6fffe9] hover:scale-105 transition">
          <Send/>
        </button>
      </div>
    </>
  )
}
