import { useAuth } from '../../context/AuthContext'

export default function HostProfile() {
  const { user } = useAuth()

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Profile</h1>
      <div className="bg-white rounded-xl shadow-md p-6">
        <p className="text-slate-700">
          <span className="font-medium text-slate-900">Username:</span> {user?.username}
        </p>
        <p className="text-slate-700 mt-2">
          <span className="font-medium text-slate-900">Role:</span> {user?.role}
        </p>
      </div>
    </div>
  )
}
