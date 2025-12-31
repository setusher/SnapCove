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
    <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--primary-bg)', padding: 'var(--space-12) var(--space-4)' }}>
      <div className="card" style={{ padding: 'var(--space-12)', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <h2 className="heading-lg" style={{ marginBottom: 'var(--space-6)' }}>Choose Your Role</h2>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
          {roles.map(r => (
            <button
              key={r}
              onClick={() => select(r)}
              className="btn btn-secondary"
              style={{ padding: 'var(--space-5)', textTransform: 'capitalize' }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

