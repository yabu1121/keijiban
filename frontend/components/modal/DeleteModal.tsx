'use client'
import { deletePosts } from "@/actions/postApi";
import { usePostDeleteModalStore } from "@/store/useModalstore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const DeleteModal = () => {
  const queryClient = useQueryClient();
  const { modalId, closeModal } = usePostDeleteModalStore();

  const { mutate, isPending } = useMutation({
    mutationFn: (targetId: number) => deletePosts(targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      closeModal()
      toast.success('削除しました')
    }
  })

  if (modalId === null) return null

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    closeModal()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    mutate(modalId)
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* 閉じるボタン */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute", top: "16px", right: "16px",
            width: "32px", height: "32px",
            background: "var(--bg-hover)", border: "1px solid var(--border)",
            borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-muted)", transition: "all 0.15s ease",
          }}
        >
          <X size={16} />
        </button>

        {/* アイコン */}
        <div style={{
          width: "52px", height: "52px",
          background: "rgba(224, 82, 82, 0.12)",
          borderRadius: "12px",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "20px",
        }}>
          <AlertTriangle size={26} color="var(--danger)" />
        </div>

        <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
          本当に削除しますか？
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "28px" }}>
          この操作は元に戻すことができません。削除した投稿は復元できません。
        </p>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={handleClose} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
            キャンセル
          </button>
          <button
            onClick={handleDelete}
            className="btn-danger"
            disabled={isPending}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px" }}
          >
            <Trash2 size={14} />
            {isPending ? "削除中..." : "削除する"}
          </button>
        </div>
      </div>
    </div>
  )
}