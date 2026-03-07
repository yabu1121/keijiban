'use client'
import { Trash2 } from 'lucide-react'
import { usePostDeleteModalStore } from '@/store/useModalstore'

export const PostDeleteButton = ({ id }: { id: number }) => {
  const { openModal } = usePostDeleteModalStore()

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    openModal(id)
  }

  return (
    <button
      onClick={handleOpen}
      title="削除"
      style={{
        background: "transparent",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        width: "30px", height: "30px",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        color: "var(--text-muted)",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--danger)"
          ; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--danger)"
          ; (e.currentTarget as HTMLButtonElement).style.background = "rgba(224,82,82,0.1)"
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"
          ; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"
          ; (e.currentTarget as HTMLButtonElement).style.background = "transparent"
      }}
    >
      <Trash2 size={13} />
    </button>
  )
}