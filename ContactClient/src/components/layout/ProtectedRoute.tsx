import { RootState } from "@/redux/SliceStore"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {

    const isLogin:Boolean=useSelector((state:RootState)=>state.user.login)
    if (!isLogin) {
        return <Navigate to="/login" replace />;
    }

  return <Outlet/>
}

export default ProtectedRoute