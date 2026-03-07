import { SignUp } from "@/actions/signup";
import { User, Mail, Lock } from "lucide-react";

export const SignUpForm = () => (
  <form action={SignUp} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
    <div className="form-group">
      <label className="label" htmlFor="name">
        <User size={12} style={{ display: "inline", marginRight: "4px" }} />
        名前
      </label>
      <input
        id="name"
        name="name"
        type="text"
        className="input"
        placeholder="山田 太郎"
      />
    </div>
    <div className="form-group">
      <label className="label" htmlFor="email">
        <Mail size={12} style={{ display: "inline", marginRight: "4px" }} />
        メールアドレス
      </label>
      <input
        id="email"
        name="email"
        type="email"
        className="input"
        placeholder="your@email.com"
      />
    </div>
    <div className="form-group">
      <label className="label" htmlFor="password">
        <Lock size={12} style={{ display: "inline", marginRight: "4px" }} />
        パスワード
      </label>
      <input
        id="password"
        name="password"
        type="password"
        className="input"
        placeholder="••••••••"
      />
    </div>
    <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
      アカウントを作成
    </button>
  </form>
)
