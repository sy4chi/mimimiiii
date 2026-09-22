import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "같이배움 학생용",
  description: "학생과 선생님이 실시간으로 소통하는 과외 및 멘토링 매칭 서비스",
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
