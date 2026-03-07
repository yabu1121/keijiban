import { Login } from "@/actions/login";
import { Mail, Lock } from "lucide-react";

export const LoginForm = () => (
  <form action={Login} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
      ログイン
    </button>
  </form>
)
