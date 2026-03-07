'use client'
import { getPosts } from '@/actions/postApi'
import { GetPostResponse } from '@/types/post'
import { useQuery } from '@tanstack/react-query'
import { PostRow } from './PostRow'
import { FileX } from 'lucide-react'

const PostList = () => {
  const { data: posts, isPending, isError } = useQuery<GetPostResponse[]>({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  if (isPending) return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "40px 0", color: "var(--text-muted)" }}>
      <div className="spinner" />
      <span>読み込み中...</span>
    </div>
  )

  if (isError) return (
    <div className="card" style={{ textAlign: "center", padding: "48px", color: "var(--text-muted)" }}>
      <FileX size={40} style={{ margin: "0 auto 12px" }} />
      <p style={{ fontSize: "15px" }}>投稿の読み込みに失敗しました</p>
    </div>
  )

  if (posts.length === 0) return (
    <div className="card" style={{ textAlign: "center", padding: "48px" }}>
      <FileX size={40} color="var(--text-muted)" style={{ margin: "0 auto 12px" }} />
      <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>まだ投稿がありません</p>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "4px" }}>最初の投稿を作成してみましょう</p>
    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {posts.map((post) => <PostRow key={post.id} post={post} />)}
    </div>
  )
}

export default PostList