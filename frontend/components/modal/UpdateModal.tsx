'use client'
import { getPost, updatePost } from "@/actions/postApi";
import { usePostUpdateModalStore } from "@/store/useModalstore";
import { CreatePostRequest } from "@/types/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Edit3, Save } from "lucide-react";
import { toast } from "sonner";

export const UpdateModal = () => {
  const queryClient = useQueryClient();
  const { modalId, closeModal } = usePostUpdateModalStore();

  const { data: post, isPending } = useQuery({
    queryKey: ['post', modalId],
    queryFn: () => getPost(modalId as number),
    enabled: !!modalId
  })

  const { mutate } = useMutation({
    mutationFn: ({ targetId, targetPost }: {
      targetId: number,
      targetPost: CreatePostRequest
    }) => updatePost(targetId, targetPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('更新しました')
      closeModal()
    }
  })

  if (modalId === null) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget
    const formData = new FormData(e.currentTarget);
    const req = {
      title: String(formData.get('title') ?? ""),
      content: String(formData.get('content') ?? ""),
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
            <Edit3 size={20} color="var(--accent)" />
          </div>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
            投稿を編集
          </p>
        </div>

        {isPending ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)" }}>
            <div className="spinner" style={{ margin: "0 auto 10px" }} />
            <p style={{ fontSize: "13px" }}>読み込み中...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} id="edit-form" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="form-group">
              <label className="label" htmlFor="update-title">タイトル</label>
              <input
                id="update-title"
                defaultValue={post?.title}
                name="title"
                type="text"
                className="input"
                placeholder="タイトルを入力..."
              />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="update-content">本文</label>
              <textarea
                id="update-content"
                defaultValue={post?.content}
                name="content"
                className="input"
                placeholder="内容を入力..."
                rows={4}
                style={{ resize: "vertical", fontFamily: "inherit" }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button type="button" onClick={handleClose} className="btn-ghost" style={{ flex: 1, justifyContent: "center" }}>
                キャンセル
              </button>
              <button type="submit" form="edit-form" className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                <Save size={15} />
                更新する
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}