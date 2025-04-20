import { Navigate, Outlet } from "react-router-dom"

function PrivateRoute({ user }: { user: any }) {
  return user ? <Outlet /> : <Navigate to="/" replace />
}

export default PrivateRoute
