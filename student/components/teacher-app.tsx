"use client";

import { MessageCircle, UserRound } from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";

export function TeacherApp() {
  return (
    <div className="teacher-shell">
      <aside className="teacher-sidebar">
        <div className="teacher-brand"><span>T</span><div><strong>선생님 센터</strong><small>과외 &amp; 멘토링</small></div></div>
        <p className="sidebar-label">대화 목록</p>
        <button className="student-room active"><span className="student-avatar"><UserRound /></span><span><strong>학생</strong><small>고등 수학 문의</small></span></button>
        <a href="/" className="student-view-link">학생용 화면 보기</a>
      </aside>
      <main className="teacher-main">
        <header className="teacher-chat-header"><div><h1>학생</h1><p><span className="online-dot" /> 수학 · 고등과정 상담</p></div><MessageCircle /></header>
        <ChatPanel role="teacher" />
      </main>
    </div>
  );
}
