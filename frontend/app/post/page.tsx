import { DeleteModal } from "@/components/modal/DeleteModal";
import { UpdateModal } from "@/components/modal/UpdateModal";
import PostForm from "@/components/PostForm";
import PostList from "@/components/PostList";
import { FileText } from "lucide-react";

const page = () => {
  return (
    <div className="fade-in">
      {/* ページヘッダー */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
        <div style={{
          width: "40px", height: "40px",
          background: "var(--accent-muted)",
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <FileText size={20} color="var(--accent)" />
        </div>
        <div>
          <h1 className="section-title" style={{ marginBottom: "2px" }}>投稿一覧</h1>
          <p className="section-sub">みんなの投稿を見てみましょう</p>
        </div>
      </div>

      {/* 投稿リスト */}
      <PostList />

      {/* 投稿フォーム */}
      <div style={{ marginTop: "40px", borderTop: "1px solid var(--border)", paddingTop: "32px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "16px" }}>
          新しい投稿を作成
        </h2>
        <PostForm />
      </div>

      <DeleteModal />
      <UpdateModal />
    </div>
  )
}

export default page