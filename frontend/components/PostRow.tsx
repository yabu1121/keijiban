import { GetPostResponse } from "@/types/post"
import { formatDate } from "@/util/formatDate"
import Link from "next/link"
import { PostUpdateButton } from "./PostUpdateButton"
import { PostDeleteButton } from "./PostDeleteButton"
import { Clock, Edit3 } from "lucide-react"

export const PostRow = ({ post }: { post: GetPostResponse }) => {
  return (
    <Link href={`/post/${post.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="card" style={{ cursor: "pointer", transition: "transform 0.15s ease, border-color 0.2s ease, box-shadow 0.2s ease" }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"
        }}
      >
        {/* ヘッダー行 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <span style={{
            fontSize: "11px", color: "var(--text-muted)",
            fontFamily: "monospace", background: "var(--bg-surface)",
            padding: "2px 8px", borderRadius: "4px", border: "1px solid var(--border)"
          }}>
            #{post.id}
          </span>
          <div style={{ display: "flex", gap: "8px" }} onClick={e => e.preventDefault()}>
            <PostUpdateButton id={post.id} />
            <PostDeleteButton id={post.id} />
          </div>
        </div>

        {/* タイトル */}
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", lineHeight: 1.4 }}>
          {post.title}
        </h2>

        {/* 本文プレビュー */}
        <p style={{
          fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          marginBottom: "16px"
        }}>
          {post.content}
        </p>

        {/* フッター */}
        <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Clock size={11} />
            作成: {formatDate(post.createdAt)}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Edit3 size={11} />
            更新: {formatDate(post.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}
