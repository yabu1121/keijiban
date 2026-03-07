import { getMyInfomation } from '@/actions/getMyInfomation'
import { User, Mail, Hash, FileText } from 'lucide-react'

const page = async () => {
  const user = await getMyInfomation()

  return (
    <div className="fade-in">
      <h1 className="section-title">ダッシュボード</h1>
      <p className="section-sub" style={{ marginBottom: "32px" }}>アカウント情報の確認</p>

      {user ? (
        <div className="card" style={{ maxWidth: "480px" }}>
          {/* アバター */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{
              width: "56px", height: "56px",
              background: "linear-gradient(135deg, var(--accent), #a855f7)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <User size={28} color="#fff" />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "18px", color: "var(--text-primary)" }}>{user.name}</p>
              <span className="badge">メンバー</span>
            </div>
          </div>

          <hr className="divider" />

          {/* 情報リスト */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Hash size={14} color="var(--text-muted)" />
              <span style={{ color: "var(--text-muted)", fontSize: "13px", width: "60px" }}>ユーザーID</span>
              <span style={{ color: "var(--text-primary)", fontSize: "14px", fontFamily: "monospace" }}>{user.id}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <User size={14} color="var(--text-muted)" />
              <span style={{ color: "var(--text-muted)", fontSize: "13px", width: "60px" }}>名前</span>
              <span style={{ color: "var(--text-primary)", fontSize: "14px" }}>{user.name}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ maxWidth: "480px", textAlign: "center", padding: "48px" }}>
          <User size={40} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
          <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>ログイン情報が取得できませんでした</p>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>ログインしてください</p>
        </div>
      )}
    </div>
  )
}

export default page