import { CommentCreateModal } from "@/components/modal/CommentPostModal";
import { CommentList } from "@/components/CommentList";
import { CommentPostButton } from "@/components/CommentPostButton";
import { Post } from "@/types/post";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Clock } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

const page = async ({ params }: Props) => {
  const { id } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/post/${id}`)
  const post: Post = await res.json()

  return (
    <div className="fade-in">
      {/* 戻るリンク */}
      <Link href="/post" style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        color: "var(--text-muted)", fontSize: "13px", textDecoration: "none",
        marginBottom: "24px",
        transition: "color 0.15s ease",
      }}
        className="nav-back"
      >
        <ArrowLeft size={14} />
        投稿一覧に戻る
      </Link>

      {/* 記事本文 */}
      <div className="card" style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "16px", lineHeight: 1.3 }}>
          {post.title}
        </h1>
        <hr className="divider" />
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
          {post.content}
        </p>
      </div>

      {/* コメントセクション */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <MessageSquare size={18} color="var(--accent)" />
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>コメント</h2>
          </div>
          <CommentPostButton id={Number(id)} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <CommentList postId={Number(id)} />
        </div>
      </div>

      <CommentCreateModal />
    </div>
  )
}

export default page