"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabase } from "@/lib/supabase";

type Message = {
  id: number;
  room: string;
  sender: "student" | "teacher";
  senderName: string;
  body: string;
  createdAt: string;
};

type MessageRow = {
  id: number;
  room: string;
  sender: "student" | "teacher";
  sender_name: string;
  body: string;
  created_at: string;
};

export function ChatPanel({ role, room = "kim-math", compact = false }: { role: "student" | "teacher"; room?: string; compact?: boolean }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const ownName = role === "student" ? "학생" : "김선생";

  const loadMessages = useCallback(async () => {
    try {
      const { data, error: queryError } = await getSupabase()
        .from("messages")
        .select("id, room, sender, sender_name, body, created_at")
        .eq("room", room)
        .order("id", { ascending: true })
        .limit(100);
      if (queryError) throw queryError;
      setMessages(((data ?? []) as MessageRow[]).map((row) => ({
        id: row.id,
        room: row.room,
        sender: row.sender,
        senderName: row.sender_name,
        body: row.body,
        createdAt: row.created_at,
      })));
      setError("");
    } catch {
      setError("대화를 불러오지 못했어요. 환경변수와 Supabase 설정을 확인해 주세요.");
    }
  }, [room]);

  useEffect(() => {
    void loadMessages();
    const timer = window.setInterval(() => void loadMessages(), 1200);
    return () => window.clearInterval(timer);
  }, [loadMessages]);

  useEffect(() => {
    const box = boxRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [messages]);

  async function sendMessage() {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setError("");
    try {
      const { error: insertError } = await getSupabase().from("messages").insert({
        room,
        sender: role,
        sender_name: ownName,
        body,
      });
      if (insertError) throw insertError;
      setDraft("");
      await loadMessages();
    } catch {
      setError("메시지를 보내지 못했어요. 환경변수와 Supabase 정책을 확인해 주세요.");
    } finally {
      setSending(false);
    }
  }

  async function deleteMessage(id: number) {
    if (deletingId !== null || !window.confirm("이 메시지를 삭제할까요?")) return;
    setDeletingId(id);
    setError("");
    try {
      const { error: deleteError } = await getSupabase().from("messages").delete().eq("id", id).eq("sender", role);
      if (deleteError) throw deleteError;
      setMessages((current) => current.filter((message) => message.id !== id));
    } catch {
      setError("메시지를 삭제하지 못했어요. Supabase 삭제 정책을 확인해 주세요.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="chat-panel">
      <div ref={boxRef} className={`chat-scroll ${compact ? "compact" : ""}`} aria-live="polite">
        {messages.length === 0 && !error ? (
          <div className="chat-empty">아직 메시지가 없어요.<br />먼저 인사를 건네 보세요.</div>
        ) : null}
        {messages.map((message) => {
          const mine = message.sender === role;
          return (
            <div className={`message-line ${mine ? "mine" : "theirs"}`} key={message.id}>
              {!mine && <div className="message-avatar">{message.sender === "teacher" ? "김" : "학"}</div>}
              <div className="message-stack">
                {!mine && <span className="message-name">{message.senderName}</span>}
                <div className="message-bubble">{message.body}</div>
                <div className="message-meta">
                  {mine && <button type="button" className="message-delete" onClick={() => void deleteMessage(message.id)} disabled={deletingId === message.id} aria-label="메시지 삭제"><Trash2 /></button>}
                  <time>{new Date(message.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</time>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {error && <p className="chat-error">{error}</p>}
      <div className="composer">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.nativeEvent.isComposing) void sendMessage();
          }}
          placeholder="메시지를 입력하세요"
          maxLength={1000}
          aria-label="메시지"
        />
        <Button onClick={() => void sendMessage()} disabled={!draft.trim() || sending} size="icon" aria-label="보내기">
          <Send />
        </Button>
      </div>
    </div>
  );
}
