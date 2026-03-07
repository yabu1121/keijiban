'use client'
import { useCommentCreateModalStore } from '@/store/useModalstore'
import { MessageSquarePlus } from 'lucide-react'

export const CommentPostButton = ({ id }: { id: number }) => {
  const { openModal } = useCommentCreateModalStore();
  const handlePost = (e: React.MouseEvent) => {
    e.preventDefault();
    openModal(id);
  }
  return (
    <button className="btn-primary" onClick={handlePost} style={{ fontSize: "13px", padding: "8px 14px" }}>
      <MessageSquarePlus size={15} />
      コメントを投稿
    </button>
  )
}
