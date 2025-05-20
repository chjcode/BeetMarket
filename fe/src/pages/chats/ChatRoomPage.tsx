// src/pages/chats/ChatRoomPage.tsx

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

interface ChatMessageResponse {
  id: string;
  roomId: number;
  senderNickname: string;
  type: "TEXT" | "IMAGE";
  content: string;
  timestamp: string;
}

interface ReadAckResponse {
  roomId: number;
  readerNickname: string;
  lastReadMessageId: string;
  lastReadAt: string;
}

const WS_URL = "https://beet.joonprac.shop:8700/ws-chat";

const ChatRoomPage = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);

  const clientRef = useRef<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [readAcks, setReadAcks] = useState<ReadAckResponse[]>([]);
  const [input, setInput] = useState("");

  const myNickname = localStorage.getItem("myNickname") ?? "";
  const counterpartNickname = localStorage.getItem("counterpartNickname") ?? "";
  const accessToken = localStorage.getItem("accessToken") ?? "";

  // 읽음 확인 전송
  const sendReadAck = (lastReadMessageId: string) => {
    const ack = {
      roomId,
      counterpartNickname,
      lastReadMessageId,
    };

    clientRef.current?.publish({
      destination: "/pub/chat/read",
      body: JSON.stringify(ack),
    });
  };

  useEffect(() => {
    const socket = new SockJS(`${WS_URL}?access-token=${accessToken}`);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (msg) => console.log("[STOMP DEBUG]", msg),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("[STOMP] 연결 성공");
        setConnected(true);

        // 채팅 메시지 구독
        client.subscribe(
          `/user/sub/chat/room/${roomId}`,
          (message: IMessage) => {
            const msg: ChatMessageResponse = JSON.parse(message.body);
            setMessages((prev) => [...prev, msg]);

            // 내가 받은 메시지에 대해 읽음 확인 전송
            if (msg.senderNickname !== myNickname) {
              sendReadAck(msg.id);
            }
          }
        );

        // 읽음 확인 구독
        client.subscribe(
          `/user/sub/chat/read/${roomId}`,
          (message: IMessage) => {
            const ack: ReadAckResponse = JSON.parse(message.body);
            setReadAcks((prev) => [...prev, ack]);
          }
        );

        // (선택) 알림 구독
        client.subscribe(
          `/user/${myNickname}/sub/notifications`,
          (message: IMessage) => {
            const notification = JSON.parse(message.body);
            console.log("[알림 수신]", notification);
          }
        );
      },
      onStompError: (frame) => {
        console.error("[STOMP] 에러", frame.headers["message"]);
        setConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomId, accessToken]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const payload = {
      roomId,
      receiverNickname: counterpartNickname,
      type: "TEXT",
      content: input,
    };

    clientRef.current?.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(payload),
    });

    setInput("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">ChatRoom #{roomId}</h1>
      <p className="text-sm mb-2">
        연결 상태: {connected ? "✅ 연결됨" : "❌ 연결 안됨"}
      </p>

      <div className="h-60 overflow-y-auto border rounded p-2 bg-gray-100">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-1">
            <strong>{msg.senderNickname}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <input
        className="mt-2 p-2 border rounded w-full"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        placeholder="메시지를 입력하세요..."
      />

      <button
        onClick={sendMessage}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        보내기
      </button>

      {readAcks.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          <h2 className="font-semibold mb-1">읽음 확인 내역</h2>
          {readAcks.map((ack, idx) => (
            <div key={idx}>
              ✅ {ack.readerNickname}님이 {ack.lastReadMessageId}까지 읽음 (
              {new Date(ack.lastReadAt).toLocaleTimeString()})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatRoomPage;
