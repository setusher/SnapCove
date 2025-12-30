import { useEffect, useState } from "react"
import { api } from "../api/api"
import { X, Heart } from "lucide-react"

export default function PhotoModal({ photo, onClose }) {
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

  const sendComment = async () => {
    if(!text.trim()) return
    const r = await api.post(`/photos/${photo.id}/comments/`, { content:text })
    setComments([r.data, ...comments])
    setText("")
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center">
      <div className="bg-[#1c2541] rounded-3xl w-[80vw] h-[80vh] grid grid-cols-2 overflow-hidden">
        
        <img src={photo.image} className="w-full h-full object-cover"/>

        <div className="p-6 flex flex-col">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Comments</h2>
            <X onClick={onClose} className="cursor-pointer"/>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto">
            {comments.map(c=>(
              <div key={c.id}>
                <p className="text-sm"><b>{c.user.name}</b> {c.content}</p>
                {c.replies.map(r=>(
                  <p key={r.id} className="ml-4 text-xs text-gray-400">
                    ↳ {r.user.name}: {r.content}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Heart
              onClick={toggleLike}
              className={`cursor-pointer ${liked ? "fill-[#5bc0be] text-[#5bc0be]" : "text-gray-400"}`}
            />
            <input
              value={text}
              onChange={e=>setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-black/40 rounded-lg px-3 py-2 text-sm outline-none"
            />
            <button onClick={sendComment} className="text-[#6fffe9]">Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}
