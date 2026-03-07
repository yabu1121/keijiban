'use client'
import { Logout } from "@/actions/logout"
import { LogOut } from "lucide-react"

const LogoutButton = () => {
  return (
    <button
      onClick={Logout}
      className="btn-ghost"
      style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px" }}
    >
      <LogOut size={15} />
      ログアウト
    </button>
  )
}

export default LogoutButton