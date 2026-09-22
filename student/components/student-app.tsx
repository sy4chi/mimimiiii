"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CalendarDays, MapPin, MessageCircle, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatPanel } from "@/components/chat-panel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Tab = "match" | "volunteer" | "place" | "calendar";
type Room = { id: number; title: string; date?: string; time?: string; message?: string };

const initialRooms: Room[] = [
  { id: 1, title: "중2 수학 기초 멘토링 구해요!" },
  { id: 2, title: "대전 영어 회화 단톡방" },
];

export function StudentApp() {
  const [tab, setTab] = useState<Tab>("match");
  const [chatOpen, setChatOpen] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);

  function createRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const room: Room = {
      id: Date.now(),
      title: String(data.get("title") ?? "").trim(),
      date: String(data.get("date") ?? ""),
      time: String(data.get("time") ?? ""),
      message: String(data.get("message") ?? "").trim(),
    };
    if (!room.title || !room.date || !room.time || !room.message) return;
    setRooms((current) => [room, ...current]);
    setRoomDialogOpen(false);
    event.currentTarget.reset();
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-mark">T</div>
        <div><strong>과외 &amp; 멘토링 매칭</strong><span>나에게 맞는 배움을 찾아보세요</span></div>
      </header>

      <main className="app-main">
        {tab === "match" && (
          <section>
            <div className="profile-card">
              <div className="profile-line"><div className="profile-photo">김</div><div><span>수학 · 고등과정</span><h1>김선생</h1></div></div>
              <p>충남대 컴퓨터융합학부 / 기초부터 심화까지 완벽하게 잡아드립니다.</p>
              <Button className="w-full rounded-xl" onClick={() => setChatOpen((value) => !value)}>
                <MessageCircle /> {chatOpen ? "채팅 닫기" : "1:1 채팅하기"}
              </Button>
            </div>
            {chatOpen && <div className="content-card"><h2>김선생님과 채팅</h2><ChatPanel role="student" compact /></div>}
          </section>
        )}

        {tab === "volunteer" && (
          <section>
            <div className="section-heading-row"><h1 className="section-title">멘토링 단톡방 목록</h1><Button size="sm" onClick={() => setRoomDialogOpen(true)}><Plus /> 방 만들기</Button></div>
            {rooms.map((room) => <div className="list-card" key={room.id}><strong>{room.title}</strong>{room.date && <span>{room.date} · {room.time}</span>}{room.message && <p className="room-preview">{room.message}</p>}<span>멘토/멘티 모집중</span></div>)}
          </section>
        )}

        {tab === "place" && (
          <section><h1 className="section-title">스터디룸 및 장소 예약</h1>
            <div className="map-placeholder"><MapPin /><strong>대전 주변 학습 공간</strong><span>가까운 공간을 선택해 예약하세요.</span></div>
            <div className="list-card horizontal"><div><strong>토즈 스터디룸 (유성점)</strong><span>300m · 오늘 15:00</span></div><Button variant="outline" onClick={() => setReserved(true)}>예약</Button></div>
            <div className="list-card horizontal"><div><strong>희망 지역아동센터</strong><span>800m · 오늘 17:30</span></div><Button variant="outline" onClick={() => setReserved(true)}>예약</Button></div>
            {reserved && <p className="notice">예약이 오늘 일정에 추가되었습니다.</p>}
          </section>
        )}

        {tab === "calendar" && <CalendarView reserved={reserved} rooms={rooms} />}
      </main>

      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogContent className="room-dialog sm:max-w-md">
          <DialogHeader><DialogTitle>새 멘토링 방 만들기</DialogTitle><DialogDescription>일정과 첫 메시지를 입력해 주세요.</DialogDescription></DialogHeader>
          <form className="room-form" onSubmit={createRoom}>
            <div><Label htmlFor="room-title">방 제목</Label><Input id="room-title" name="title" placeholder="예: 중2 수학 멘토링 구해요" required /></div>
            <div><Label htmlFor="room-date">날짜</Label><Input id="room-date" name="date" type="date" required /></div>
            <div><Label htmlFor="room-time">시간</Label><Input id="room-time" name="time" type="time" required /></div>
            <div><Label htmlFor="room-message">보낼 메시지</Label><Textarea id="room-message" name="message" placeholder="일정과 원하는 수업 내용을 알려주세요." required /></div>
            <Button type="submit" className="w-full">방 만들기</Button>
          </form>
        </DialogContent>
      </Dialog>

      <nav className="bottom-nav">
        <NavButton active={tab === "match"} onClick={() => setTab("match")} icon={<MessageCircle />} label="과외매칭" />
        <NavButton active={tab === "volunteer"} onClick={() => setTab("volunteer")} icon={<Users />} label="교육봉사" />
        <NavButton active={tab === "place"} onClick={() => setTab("place")} icon={<MapPin />} label="장소예약" />
        <NavButton active={tab === "calendar"} onClick={() => setTab("calendar")} icon={<CalendarDays />} label="캘린더" />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return <button className={active ? "active" : ""} onClick={onClick}>{icon}<span>{label}</span></button>;
}

function CalendarView({ reserved, rooms }: { reserved: boolean; rooms: Room[] }) {
  const days = [0, 1, 2, 3, 4].map((offset) => { const date = new Date(); date.setDate(date.getDate() + offset); return date; });
  const [selected, setSelected] = useState(0);
  const selectedKey = `${days[selected].getFullYear()}-${String(days[selected].getMonth() + 1).padStart(2, "0")}-${String(days[selected].getDate()).padStart(2, "0")}`;
  const roomSchedules = rooms.filter((room) => room.date === selectedKey);
  const hasSchedule = (selected === 0 && reserved) || roomSchedules.length > 0;
  return <section><h1 className="section-title">캘린더 및 시간표</h1><div className="date-strip">{days.map((day, index) => <button key={day.toISOString()} className={selected === index ? "active" : ""} onClick={() => setSelected(index)}><span>{index === 0 ? "오늘" : index === 1 ? "내일" : "\u00a0"}</span><strong>{day.getDate()}일</strong></button>)}</div><h2 className="schedule-title">{String(days[selected].getMonth() + 1).padStart(2, "0")}월 {String(days[selected].getDate()).padStart(2, "0")}일 일정표</h2>{selected === 0 && reserved && <div className="schedule-card"><b>15:00</b><span>토즈 스터디룸 (유성점)</span></div>}{roomSchedules.map((room) => <div className="schedule-card" key={room.id}><b>{room.time}</b><span>{room.title}</span></div>)}{!hasSchedule && <div className="empty-card">이 날은 등록된 일정이 없습니다.</div>}</section>;
}
