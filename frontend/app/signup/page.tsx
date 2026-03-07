import { SignUpForm } from "@/components/SignUpForm"
import Link from "next/link"
import { UserPlus } from "lucide-react"

const SignUpPage = () => {
  return (
    <div className="fade-in" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
      <div className="card" style={{ width: "100%", maxWidth: "420px" }}>
        {/* ヘッダー */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "48px", height: "48px",
            background: "var(--accent-muted)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <UserPlus size={22} color="var(--accent)" />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>ユーザー登録</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>新しいアカウントを作成します</p>
        </div>

        <SignUpForm />

        <hr className="divider" />
        <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)" }}>
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 500 }}>
            こちらでログイン
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUpPage