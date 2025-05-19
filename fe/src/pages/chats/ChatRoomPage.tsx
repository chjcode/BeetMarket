import { useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "react-router-dom";
import axiosInstance from "@/shared/api/axiosInstance";
import { Icon } from "@/shared/ui/Icon";

interface ChatMessageResponse {
  id: string;
  roomId: number;
  senderNickname: string;
  type: "TEXT" | "IMAGE";
  content: string;
  timestamp: string;
}

const ChatRoomPage = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);

  const myNickname = localStorage.getItem("myNickname") ?? "me";
  const counterpartNickname =
    localStorage.getItem("counterpartNickname") ?? "상대방";
  const accessToken = localStorage.getItem("accessToken") ?? "";

  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);

  // 1) 과거 채팅 기록 조회
  useEffect(() => {
    if (!roomId) return;

    const fetchChatHistory = async () => {
      try {
        const res = await axiosInstance.get<{
          content: ChatMessageResponse[];
        }>(`/api/chat/rooms/${roomId}/messages`, {
          params: { page: 0, size: 20, sortOrder: "desc" },
        });

        const sorted = res.data.content.reverse();
        setMessages(sorted);
      } catch (error) {
        console.error("채팅 기록 조회 실패:", error);
      }
    };

    fetchChatHistory();
  }, [roomId]);

  // 2) WebSocket(STOMP) 연결 및 실시간 처리
  useEffect(() => {
    if (!roomId || !accessToken) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(
          `https://k12a307.p.ssafy.io/ws-chat?access-token=${accessToken}`
        ),
      reconnectDelay: 5000,
      debug: (msg) => console.log("[STOMP]", msg),
      onConnect: () => {
        console.log("STOMP connected");

        // 메시지 수신 구독
        client.subscribe(
          `/user/${myNickname}/sub/chat/room/${roomId}`,
          (message: IMessage) => {
            const body: ChatMessageResponse = JSON.parse(message.body);
            setMessages((prev) => [...prev, body]);

            if (body.senderNickname === counterpartNickname) {
              sendReadAck(body.id);
            }
          }
        );

        // 읽음 확인 구독
        client.subscribe(
          `/user/${myNickname}/sub/chat/read/${roomId}`,
          (message: IMessage) => {
            const ack = JSON.parse(message.body);
            console.log("읽음 확인 수신:", ack);
          }
        );
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
    // counterpartNickname은 sendReadAck 안에서만 쓰이므로 deps에 생략 가능
  }, [accessToken, roomId, myNickname]);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송
  const sendMessage = () => {
    if (!input.trim() || !clientRef.current?.connected) return;

    const payload = {
      roomId,
      receiverNickname: counterpartNickname,
      type: "TEXT",
      content: input.trim(),
    };

    clientRef.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(payload),
    });

    setInput("");
  };

  // 읽음 ACK 전송
  const sendReadAck = (messageId: string) => {
    if (!clientRef.current?.connected) return;

    const ackPayload = {
      roomId,
      counterpartNickname,
      lastReadMessageId: messageId,
    };

    clientRef.current.publish({
      destination: "/pub/chat/read",
      body: JSON.stringify(ackPayload),
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 메시지 리스트 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
              className={`p-2 rounded-xl max-w-[70%] text-sm ${
                msg.senderNickname === myNickname
                  ? "bg-purple-200 text-right"
                  : "bg-gray-200 text-left"
              }`}
            >
              <div>{msg.content}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString("ko-KR", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="py-2 bg-white flex items-center gap-2 px-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          className="flex-1 border border-gray-400 rounded-full py-2 px-4"
          placeholder="메시지를 입력하세요"
        />
        <button
          onClick={sendMessage}
          className="bg-[#A349A4] text-white p-2 rounded-full w-10 h-10 flex justify-center items-center"
        >
          <Icon name="send" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
