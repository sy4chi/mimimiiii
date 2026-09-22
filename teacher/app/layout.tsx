import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "같이배움 선생님용",
  description: "학생과 실시간으로 소통하는 같이배움 선생님용 채팅 화면",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
