'use client'
import { createComment } from "@/actions/commentApi";
import { useCommentCreateModalStore } from "@/store/useModalstore";
import { CreateCommentRequest } from "@/types/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, MessageSquarePlus, Send } from "lucide-react";
import { toast } from "sonner";

export const CommentCreateModal = () => {
  const queryClient = useQueryClient();
  const { modalId, closeModal } = useCommentCreateModalStore();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ targetId, targetPost }: {
      targetId: number,
      targetPost: CreateCommentRequest
    }) => createComment({ postId: targetId, req: targetPost }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success('コメントを投稿しました！')
      closeModal()
    }
  })

  if (modalId === null) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget
    const formData = new FormData(e.currentTarget);
    const req: CreateCommentRequest = {
      title: String(formData.get('title') ?? ""),
      content: String(formData.get('content') ?? ""),
      postId: modalId,
    };
    mutate({ targetId: modalId, targetPost: req }, {
      onSuccess: () => form.reset()
    })
  };

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">
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

        {/* ヘッダー */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
          <div style={{
            width: "40px", height: "40px",
            background: "var(--accent-muted)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <MessageSquarePlus size={20} color="var(--accent)" />
          </div>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
            コメントを投稿
          </p>
        </div>

        <form onSubmit={handleSubmit} id="post-form" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group">
            <label className="label" htmlFor="comment-title">件名</label>
            <input
              id="comment-title"
              name="title"
              type="text"
              className="input"
              placeholder="コメントの件名..."
              required
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="comment-content">内容</label>
            <textarea
              id="comment-content"
              name="content"
              className="input"
              placeholder="コメント内容を入力..."
              rows={4}
              style={{ resize: "vertical", fontFamily: "inherit" }}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button type="button" onClick={handleClose} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
              キャンセル
            </button>
            <button
              type="submit"
              form="post-form"
              className="btn-primary"
              disabled={isPending}
              style={{ flex: 1, justifyContent: "center", opacity: isPending ? 0.7 : 1 }}
            >
              <Send size={14} />
              {isPending ? "投稿中..." : "投稿する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}