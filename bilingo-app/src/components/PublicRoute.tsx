import { Navigate, Outlet } from "react-router-dom"

function PublicRoute({ user }: { user: any }) {
  // Redirect to the home page if the user is already logged in
  return user ? <Navigate to="/home" replace /> : <Outlet />
}

export default PublicRoute
