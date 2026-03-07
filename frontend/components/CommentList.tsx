'use client'
import { getComments } from "@/actions/commentApi";
import { GetCommentResponse } from "@/types/comment";
import { formatDate } from "@/util/formatDate";
import { useQuery } from "@tanstack/react-query"
import { User, Clock } from "lucide-react";

export const CommentList = ({ postId }: { postId: number }) => {
  const { data: comments, isLoading, isError } = useQuery<GetCommentResponse[]>({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
  })

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "24px 0", color: "var(--text-muted)" }}>
      <div className="spinner" />
      <span style={{ fontSize: "14px" }}>コメント読み込み中...</span>
    </div>
  )

  if (isError || !comments) return (
    <p style={{ color: "var(--text-muted)", fontSize: "14px", padding: "16px 0" }}>コメントはありません。</p>
  )

  if (comments.length === 0) return (
    <div className="card" style={{ textAlign: "center", padding: "32px" }}>
      <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>まだコメントがありません。最初のコメントを投稿しましょう！</p>
    </div>
  )

  return (
    <>
      {comments.map((item: GetCommentResponse, i: number) => (
        <div key={i} className="card">
          {/* コメントヘッダー */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "28px", height: "28px",
                background: "var(--accent-muted)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <User size={14} color="var(--accent)" />
              </div>
              <span style={{ color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500 }}>
                {item.author?.name ?? "匿名"}
              </span>
            </div>
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)", fontSize: "11px" }}>
              <Clock size={11} />
              {formatDate(item.createdAt)}
            </span>
          </div>

          {/* タイトル */}
          <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
            {item.title}
          </h3>

          {/* 本文 */}
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            {item.content}
          </p>
        </div>
      ))}
    </>
  )
}