'use client'
import { usePostUpdateModalStore } from "@/store/useModalstore";
import { Pencil } from "lucide-react";

export const PostUpdateButton = ({ id }: { id: number }) => {
  const { openModal } = usePostUpdateModalStore()
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    openModal(id)
  }
  return (
    <button
      onClick={handleClick}
      title="編集"
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
        (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"
          ; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)"
          ; (e.currentTarget as HTMLButtonElement).style.background = "var(--accent-muted)"
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"
          ; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"
          ; (e.currentTarget as HTMLButtonElement).style.background = "transparent"
      }}
    >
      <Pencil size={13} />
    </button>
  )
}