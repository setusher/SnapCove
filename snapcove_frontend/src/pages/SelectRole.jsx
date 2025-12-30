import { useNavigate } from "react-router-dom"
import { api } from "../api/api"

const roles = ["student", "photographer", "coordinator"]

export default function SelectRole() {
  const nav = useNavigate()

  const select = async (role) => {
    await api.post("/auth/select-role/", { role })
    nav("/dashboard")
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <div className="glass-card p-12 max-w-xl w-full text-center space-y-6">
        <h2 className="text-3xl font-bold">Choose Your Role</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {roles.map(r => (
            <button
              key={r}
              onClick={() => select(r)}
              className="btn btn-secondary py-5 capitalize"
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
