import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"

export default function Signup(){
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const nav = useNavigate()

  const submit = async () => {
    try {
      const res = await api.post("/auth/signup/", { name, email, password })
      localStorage.setItem("access_token", res.data.access)
      localStorage.setItem("refresh_token", res.data.refresh)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      nav("/dashboard")
    } catch(e){
      alert("Signup failed")
    }
  }

  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-96 space-y-4">
        <h2 className="text-2xl font-bold">Create Account</h2>
        <input onChange={e=>setName(e.target.value)} placeholder="Name"
          className="w-full p-3 bg-black border border-gray-700 rounded"/>
        <input onChange={e=>setEmail(e.target.value)} placeholder="Email"
          className="w-full p-3 bg-black border border-gray-700 rounded"/>
        <input type="password" onChange={e=>setPassword(e.target.value)} placeholder="Password"
          className="w-full p-3 bg-black border border-gray-700 rounded"/>
        <button onClick={submit}
          className="w-full p-3 bg-indigo-600 rounded hover:bg-indigo-500">
          Sign Up
        </button>
      </div>
    </div>
  )
}
