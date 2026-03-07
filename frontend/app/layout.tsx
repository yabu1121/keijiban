import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TanstackProvider } from "./providers";
import { Toaster } from "sonner";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { BookOpen, Home, LayoutDashboard, UserPlus, LogIn, FileText } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DevBlog — 技術ブログ",
  description: "シンプルで使いやすい技術ブログプラットフォーム",
};

const navLinks = [
  { href: "/", name: "ホーム", icon: Home },
  { href: "/dashboard", name: "ダッシュボード", icon: LayoutDashboard },
  { href: "/post", name: "投稿一覧", icon: FileText },
  { href: "/signup", name: "サインアップ", icon: UserPlus },
  { href: "/login", name: "ログイン", icon: LogIn },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} antialiased`}>
        <TanstackProvider>
          <Toaster position="top-center" richColors />

          <div style={{ display: "flex", minHeight: "100vh" }}>

            {/* サイドバー（ネイビー） */}
            <aside style={{
              width: "220px",
              flexShrink: 0,
              background: "#1A365D",
              display: "flex",
              flexDirection: "column",
              padding: "24px 16px",
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              overflowY: "auto",
            }}>
              {/* ロゴ */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "36px", paddingLeft: "6px" }}>
                <div style={{
                  width: "34px", height: "34px",
                  background: "#D69E2E",
                  borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(214,158,46,0.4)",
                }}>
                  <BookOpen size={18} color="#fff" />
                </div>
                <span style={{ fontWeight: 700, fontSize: "16px", color: "#F7FAFC", letterSpacing: "0.02em" }}>DevBlog</span>
              </div>

              {/* ナビ */}
              <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} className="nav-link">
                      <Icon size={16} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              {/* バージョン表示 */}
              <div style={{ marginBottom: "8px" }}>
                <span style={{ color: "rgba(247,250,252,0.3)", fontSize: "11px", paddingLeft: "14px" }}>v1.0.0</span>
              </div>

              {/* ログアウト */}
              <div style={{ borderTop: "1px solid rgba(247,250,252,0.15)", paddingTop: "16px" }}>
                <LogoutButton />
              </div>
            </aside>

            {/* メインコンテンツ */}
            <main style={{
              marginLeft: "220px",
              flex: 1,
              padding: "40px 48px",
              maxWidth: "calc(100% - 220px)",
              background: "var(--bg-base)",
            }}>
              {children}
            </main>
          </div>
        </TanstackProvider>
      </body>
    </html>
  );
}
