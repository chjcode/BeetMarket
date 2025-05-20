import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
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
  const myOauthName = localStorage.getItem("myNickname") ?? "";
  const counterpartOauthName =
    localStorage.getItem("counterpartNickname") ?? "";
  const accessToken = localStorage.getItem("accessToken") ?? "";

  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);

  /** 닉네임 캐싱 */
  const fetchAndCacheNickname = async (oauthName: string) => {
    if (!oauthName || userMap[oauthName]) return;
    try {
      const res = await axiosInstance.get<{ content: { nickname: string } }>(
        `/api/users/oauth/${oauthName}`
      );
      setUserMap((prev) => ({
        ...prev,
        [oauthName]: res.data.content.nickname,
      }));
    } catch (err) {
      console.error("닉네임 조회 실패", oauthName, err);
    }
  };

  /** 과거 메시지 불러오기 */
  useEffect(() => {
    if (!roomId) return;
    (async () => {
      try {
        const res = await axiosInstance.get<{
          content: { messages: { content: ChatMessageResponse[] } };
        }>(`/api/chat/rooms/${roomId}/messages`, {
          params: { page: 0, size: 20, sortOrder: "desc" },
        });
        const history = res.data.content.messages.content;
        const ordered = [...history].reverse();
        setMessages(ordered);
        ordered.forEach((msg) => fetchAndCacheNickname(msg.senderNickname));
      } catch (err) {
        console.error("메시지 불러오기 실패", err);
      }
    })();
  }, [roomId]);

  /** WebSocket 연결 및 구독 */
  useEffect(() => {
    if (!roomId || !accessToken) return;

    const socketUrl = `https://k12a307.p.ssafy.io/ws-chat?access-token=${accessToken}`;
    const socket = new SockJS(socketUrl);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (msg) => console.log("[STOMP]", msg),
      onConnect: () => {
        console.log("[STOMP] 연결 성공");

        client.subscribe(
          `/user/sub/chat/room/${roomId}`,
          (message: IMessage) => {
            try {
              const body: ChatMessageResponse = JSON.parse(message.body);
              setMessages((prev) => [...prev, body]);
              fetchAndCacheNickname(body.senderNickname);
              if (body.senderNickname !== myOauthName) {
                sendReadAck(body.id);
              }
            } catch (e) {
              console.error("메시지 처리 실패", e);
            }
          }
        );

        client.subscribe(
          `/user/sub/chat/read/${roomId}`,
          (message: IMessage) => {
            try {
              const ack = JSON.parse(message.body);
              console.log("읽음 확인 수신:", ack);
            } catch (e) {
              console.error("ACK 파싱 실패", e);
            }
          }
        );
      },
      onStompError: (frame) => {
        console.error("[STOMP ERROR]", frame.headers["message"], frame.body);
      },
      onWebSocketError: (event) => {
        console.error("[WebSocket ERROR]", event);
      },
      onWebSocketClose: (event) => {
        console.warn("[WebSocket CLOSED]", event);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      console.log("[STOMP] 연결 해제");
    };
  }, [roomId, accessToken]);

  /** 자동 스크롤 */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** 메시지 전송 */
  const sendMessage = () => {
    if (!input.trim() || !clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify({
        roomId,
        receiverNickname: counterpartOauthName,
        type: "TEXT",
        content: input.trim(),
      }),
    });
    setInput("");
  };

  /** 읽음 ACK */
  const sendReadAck = (messageId: string) => {
    if (!clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: "/pub/chat/read",
      body: JSON.stringify({
        roomId,
        counterpartNickname: counterpartOauthName,
        lastReadMessageId: messageId,
      }),
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderNickname === myOauthName
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-xl max-w-[70%] text-sm ${
                msg.senderNickname === myOauthName
                  ? "bg-purple-200 text-right"
                  : "bg-gray-200 text-left"
              }`}
            >
              {msg.senderNickname !== myOauthName && (
                <div className="text-xs text-gray-500 mb-1">
                  {userMap[msg.senderNickname] ?? msg.senderNickname}
                </div>
              )}
              <div>{msg.content}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="py-2 bg-white flex items-center gap-2 px-4 border-t">
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
