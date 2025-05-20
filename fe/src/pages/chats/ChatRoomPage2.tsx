// src/pages/chats/ChatRoomPage.tsx
import { useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
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
    const socket = new SockJS(
      `${WS_HOST}${WS_ENDPOINT}?access-token=${accessToken}`
    );
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("✅ Connected to STOMP");

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
    </div>
  );
};

export default ChatRoomPage2;
