import { LayoutDashboard, FileText, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'

const quickLinks = [
  { href: "/dashboard", name: "ダッシュボード", icon: LayoutDashboard, desc: "マイページを確認" },
  { href: "/post", name: "投稿一覧", icon: FileText, desc: "みんなの投稿を見る" },
  { href: "/signup", name: "サインアップ", icon: UserPlus, desc: "新規アカウント作成" },
  { href: "/login", name: "ログイン", icon: LogIn, desc: "既存アカウントでログイン" },
]

const page = () => {
  return (
    <div className="fade-in">
      {/* ヒーロー */}
      <div style={{
        background: "linear-gradient(135deg, #1A365D 0%, #2A4A7F 60%, #1A365D 100%)",
        borderRadius: "16px",
        padding: "48px 40px",
        marginBottom: "40px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* 装飾的な円 */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "200px", height: "200px",
          background: "rgba(214, 158, 46, 0.1)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", right: "80px",
          width: "150px", height: "150px",
          background: "rgba(214, 158, 46, 0.06)",
          borderRadius: "50%",
        }} />

        <div className="badge" style={{ marginBottom: "16px", position: "relative" }}>
          🚀 技術ブログプラットフォーム
        </div>
        <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#F7FAFC", marginBottom: "12px", lineHeight: 1.2, position: "relative" }}>
          DevBlog へようこそ
        </h1>
        <p style={{ color: "rgba(247,250,252,0.75)", fontSize: "16px", maxWidth: "480px", lineHeight: 1.6, position: "relative" }}>
          技術知識を共有し、コミュニティと繋がるブログプラットフォームです。
          投稿を作成・閲覧・コメントしましょう。
        </p>

        {/* ゴールドのアクセントライン */}
        <div style={{
          marginTop: "28px", height: "3px", width: "60px",
          background: "#D69E2E",
          borderRadius: "2px", position: "relative",
        }} />
      </div>

      {/* クイックリンク */}
      <h2 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        クイックアクセス
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
        {quickLinks.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ cursor: "pointer" }}>
                <div style={{
                  width: "40px", height: "40px",
                  background: "var(--accent-muted)",
                  borderRadius: "10px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "14px",
                  border: "1px solid rgba(214,158,46,0.2)",
                }}>
                  <Icon size={20} color="var(--accent)" />
                </div>
                <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--main)", marginBottom: "4px" }}>{item.name}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item.desc}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default page