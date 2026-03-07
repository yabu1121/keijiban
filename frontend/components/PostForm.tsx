'use client'
import { createPost } from "@/actions/postApi";
import { CreatePostRequest } from "@/types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send, Type, AlignLeft } from "lucide-react";
import { toast } from "sonner";

export default function PostForm() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (targetPost: CreatePostRequest) => createPost(targetPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('投稿が完了しました！')
    },
    onError: () => {
      toast.error('投稿に失敗しました')
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget
    const formData = new FormData(e.currentTarget);
    const req = {
      title: String(formData.get('title') ?? ""),
      content: String(formData.get('content') ?? ""),
    };
    mutate(req, {
      onSuccess: () => form.reset()
    })
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div className="form-group">
        <label className="label" htmlFor="post-title">
          <Type size={12} style={{ display: "inline", marginRight: "4px" }} />
          タイトル
        </label>
        <input
          id="post-title"
          name="title"
          type="text"
          className="input"
          placeholder="投稿のタイトルを入力..."
          required
        />
      </div>
      <div className="form-group">
        <label className="label" htmlFor="post-content">
          <AlignLeft size={12} style={{ display: "inline", marginRight: "4px" }} />
          本文
        </label>
        <textarea
          id="post-content"
          name="content"
          className="input"
          placeholder="内容を入力..."
          rows={4}
          style={{ resize: "vertical", fontFamily: "inherit" }}
          required
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="submit"
          className="btn-primary"
          disabled={isPending}
          style={{ opacity: isPending ? 0.7 : 1 }}
        >
          {isPending ? (
            <>
              <Loader2 size={15} style={{ animation: "spin 0.7s linear infinite" }} />
              投稿中...
            </>
          ) : (
            <>
              <Send size={15} />
              投稿する
            </>
          )}
        </button>
      </div>
    </form>
  );
}