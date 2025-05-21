// src/pages/chats/ChatRoomPage.tsx
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";

interface ChatMessageResponse {
  id: string;
  roomId: number;
  senderNickname: string;
  type: "TEXT" | "IMAGE";
  content: string;
  timestamp: string;
}

export const ChatRoomPage2 = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const myNickname = localStorage.getItem("myNickname") ?? "";
  const counterpartNickname = localStorage.getItem("counterpartNickname") ?? "";
  const accessToken = localStorage.getItem("accessToken") ?? "";

  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const lastReadMessageId = useRef<string | null>(null);
  const ackTimer = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 화면 하단으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 초기 메시지 로딩 (REST)
  const fetchInitialMessages = async () => {
    try {
      const res = await axios.get(
        `https://k12a307.p.ssafy.io/api/chat/rooms/${roomId}/messages`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setMessages(res.data);
    } catch (err) {
      console.error("초기 메시지 불러오기 실패:", err);
    }
  };

  // WebSocket 연결
  const connectWebSocket = () => {
    const wsUrl = `wss://beet.joonprac.shop:8700/ws-chat?access-token=${encodeURIComponent(
      accessToken
    )}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket 연결됨");
      // (필요시) 서버에 구독 메시지 보내기
      // ws.send(JSON.stringify({ action: "subscribe", roomId }));
    };

    ws.onmessage = (event) => {
      try {
        const msg: ChatMessageResponse = JSON.parse(event.data);
        // roomId 필터링
        if (msg.roomId !== roomId) return;

        // 받은 메시지 상태 업데이트
        setMessages((prev) => [...prev, msg]);

        // 상대방 메시지라면 읽음 처리 예약
        if (msg.senderNickname === counterpartNickname) {
          lastReadMessageId.current = msg.id;
          if (document.hasFocus()) {
            if (ackTimer.current) clearTimeout(ackTimer.current);
            ackTimer.current = window.setTimeout(sendReadAck, 500);
          }
        }
      } catch (e) {
        console.warn("🎥 WebSocket 메시지 파싱 오류:", e);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket 에러:", err);
    };

    ws.onclose = () => {
      console.log("⚙️ WebSocket 연결 종료");
      // 필요시 재연결 로직
    };
  };

  // 메시지 전송
  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const payload = {
      roomId,
      receiverNickname: counterpartNickname,
      type: "TEXT",
      content: input.trim(),
    };
    wsRef.current.send(JSON.stringify(payload));
    // 내가 보낸 메시지로도 화면에 표시
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        roomId,
        senderNickname: myNickname,
        type: "TEXT",
        content: input.trim(),
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput("");
  };

  // 읽음 확인 전송
  const sendReadAck = () => {
    if (!lastReadMessageId.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const ackPayload = {
      roomId,
      counterpartNickname,
      lastReadMessageId: lastReadMessageId.current,
    };
    wsRef.current.send(JSON.stringify(ackPayload));
    console.log("✅ 읽음 확인 전송:", ackPayload);
  };

  useEffect(() => {
    fetchInitialMessages();
    connectWebSocket();
    return () => {
      // 정리(cleanup)
      if (ackTimer.current) clearTimeout(ackTimer.current);
      wsRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderNickname === myNickname ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-xl px-4 py-2 max-w-[60%] text-sm whitespace-pre-wrap ${
                msg.senderNickname === myNickname ? "bg-purple-500 text-white" : "bg-gray-200"
              }`}
            >
              {msg.content}
              <div className="text-xs text-right text-gray-500 mt-1">
                {dayjs(msg.timestamp).format("HH:mm")}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t flex gap-2">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 border rounded"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded bg-purple-500 text-white font-semibold"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage2;
