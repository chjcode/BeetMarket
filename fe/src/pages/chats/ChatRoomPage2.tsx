// src/pages/chats/ChatRoomPage.tsx
import { useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import axiosInstance from "@/shared/api/axiosInstance";

interface ChatMessageResponse {
  id: string;
  roomId: number;
  senderNickname: string;
  type: "TEXT" | "IMAGE";
  content: string;
  timestamp: string;
}

const WS_HOST = "https://beet.joonprac.shop:8700";
const WS_ENDPOINT = "/ws-chat";

export const ChatRoomPage2 = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const myNickname = localStorage.getItem("myNickname") ?? "";
  const counterpartNickname = localStorage.getItem("counterpartNickname") ?? "";
  const accessToken = localStorage.getItem("accessToken") ?? "";

  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [input, setInput] = useState("");
  const clientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastReadMessageId = useRef<string | null>(null);
  const ackTimer = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchInitialMessages = async () => {
    try {
      const res = await axios.get(
        `https://k12a307.p.ssafy.io/api/chat/rooms/${roomId}/messages`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("🗃️ 초기 메시지 목록:", res.data);
    } catch (err) {
      console.error("❌ 초기 메시지 불러오기 실패:", err);
    }
  };

  const connectWebSocket = () => {
    console.log("WebSocket 연결 시도 중...");

    // 쿼리 파라미터 유지
    const socket = new SockJS(
      `${WS_HOST}${WS_ENDPOINT}?access-token=${accessToken}`
    );

    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`, // ← STOMP CONNECT 프레임에 포함
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Connected to STOMP");

        // 메시지 구독
        client.subscribe(`/user/sub/chat/room/${roomId}`, (msg: IMessage) => {
          const body: ChatMessageResponse = JSON.parse(msg.body);
          console.log("📩 메시지 수신:", body);
          setMessages((prev) => [...prev, body]);

          if (body.senderNickname === counterpartNickname) {
            lastReadMessageId.current = body.id;
            if (document.hasFocus()) {
              if (ackTimer.current) clearTimeout(ackTimer.current);
              ackTimer.current = setTimeout(() => sendReadAck(), 500);
            }
          }
        });

        // 읽음 확인 수신
        client.subscribe(`/user/sub/chat/read/${roomId}`, (msg: IMessage) => {
          const ack = JSON.parse(msg.body);
          console.log("📬 읽음 확인 수신:", ack);
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP 브로커 오류:", frame);
      },
      onWebSocketError: (event) => {
        console.error("❌ WebSocket 연결 오류:", event);
      },
    });

    client.activate();
    clientRef.current = client;
  };
  
  const handleScheduleSuggestion = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/chat/rooms/${roomId}/schedule-suggestion`
      );
      console.log("🧠 일정 추천 결과:", res.data);
      alert("AI 일정 추천 완료:\n" + JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error("❌ 일정 추천 실패:", err);
      alert("AI 일정 추천 요청 실패");
    }
  };

  const handleReserveSchedule = async () => {
    try {
      const res = await axiosInstance.patch(
        `/api/chat/rooms/${roomId}/reserve`
      );
      console.log("📌 일정 추가 완료:", res.data);
      alert("일정이 성공적으로 추가되었습니다!");
    } catch (err) {
      console.error("❌ 일정 추가 실패:", err);
      alert("일정 추가 요청 실패");
    }
  };
  const sendMessage = () => {
    if (!input.trim()) return;
    const payload = {
      roomId,
      receiverNickname: counterpartNickname,
      type: "TEXT",
      content: input.trim(),
    };
    console.log("📤 메시지 전송:", payload);
    console.log("📡 연결 상태:", clientRef.current?.connected);
    clientRef.current?.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(payload),
    });
    setInput("");
  };

  const sendReadAck = () => {
    if (!lastReadMessageId.current) return;
    const payload = {
      roomId,
      counterpartNickname,
      lastReadMessageId: lastReadMessageId.current,
    };
    console.log("✅ 읽음 확인 전송:", payload);
    clientRef.current?.publish({
      destination: "/pub/chat/read",
      body: JSON.stringify(payload),
    });
  };

  useEffect(() => {
    fetchInitialMessages();
    connectWebSocket();
    return () => {
      if (ackTimer.current) clearTimeout(ackTimer.current);
      clientRef.current?.deactivate();
    };
  }, []);

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderNickname === myNickname
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`rounded-xl px-4 py-2 max-w-[60%] text-sm whitespace-pre-wrap ${
                msg.senderNickname === myNickname
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200"
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
      <div className="flex gap-2">
        <button
          onClick={handleScheduleSuggestion}
          className="flex-1 px-4 py-2 rounded bg-blue-500 text-white font-semibold"
        >
          🧠 AI 일정 추천
        </button>
        <button
          onClick={handleReserveSchedule}
          className="flex-1 px-4 py-2 rounded bg-green-600 text-white font-semibold"
        >
          ➕ 일정 추가
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage2;
