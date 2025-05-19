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

const ChatRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);

  // 로컬에 저장된 OAuth 식별자
  const myOauthName = localStorage.getItem("myNickname") ?? "";
  const counterpartOauthName = localStorage.getItem("counterpartNickname") ?? "";
  const accessToken = localStorage.getItem("accessToken") ?? "";

  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);

  // OAuth 식별자로 실제 닉네임 조회 및 캐싱
  const fetchAndCacheNickname = async (oauthName: string) => {
    if (!oauthName || userMap[oauthName]) return;
    try {
      const res = await axiosInstance.get<{ content: { nickname: string } }>(
        `/api/users/oauth/${oauthName}`
      );
      console.log("닉네임 조회 성공:", res.data.content.nickname);
      setUserMap(prev => ({ ...prev, [oauthName]: res.data.content.nickname }));
    } catch (e) {
      console.error(`닉네임 조회 실패: ${oauthName}`, e);
    }
  };

  const handleScheduleSuggestion = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/chat/rooms/${roomId}/schedule-suggestion`
      );
      const suggestion = res.data.content;
      alert(
        `추천 일정:\n시간: ${suggestion.schedule}\n장소: ${suggestion.location}`
      );
    } catch (err) {
      console.error("일정 추천 실패", err);
      alert("일정 추천 요청에 실패했습니다.");
    }
  };

  const handleScheduleReserve = async () => {
    const schedule = prompt("일정 시간(예: 20250601093000)을 입력하세요:");
    const location = prompt("장소를 입력하세요:");
    if (!schedule || !location) return;

    try {
      const res = await axiosInstance.patch(
        `/api/chat/rooms/${roomId}/reserve`,
        {
          schedule,
          location,
        }
      );
      alert("일정이 성공적으로 등록되었습니다!");
      console.log("예약 응답:", res.data);
    } catch (err) {
      console.error("일정 등록 실패", err);
      alert("일정 등록 요청에 실패했습니다.");
    }
  };
  // 내/상대방 닉네임 초기 조회
  useEffect(() => {
    fetchAndCacheNickname(myOauthName);
    fetchAndCacheNickname(counterpartOauthName);
  }, []);

  // 과거 채팅 기록 조회
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
        const chronological = Array.isArray(history) ? [...history].reverse() : [];
        setMessages(chronological);
        chronological.forEach(m => fetchAndCacheNickname(m.senderNickname));
      } catch (error) {
        console.error("채팅 기록 조회 실패:", error);
      }
    })();
  }, [roomId]);

  // WebSocket(STOMP) 연결 및 실시간 처리
  useEffect(() => {
    if (!roomId || !accessToken) {
      console.warn("WebSocket 연결 조건 부족", { roomId, accessToken });
      return;
    }

    // 캐시 회피를 위한 타임스탬프 추가
    const socketUrl = `https://k12a307.p.ssafy.io/ws-chat?access-token=${accessToken}`;
    const socket = new SockJS(socketUrl);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: msg => console.log("[STOMP]", msg),
      onConnect: () => {
        console.log("[STOMP] 연결 성공");

        // 메시지 수신 구독
        client.subscribe(`/user/sub/chat/room/${roomId}`, (message: IMessage) => {
          try {
            const body: ChatMessageResponse = JSON.parse(message.body);
            setMessages(prev => [...prev, body]);
            fetchAndCacheNickname(body.senderNickname);

            // 읽음 ACK 전송
            if (body.senderNickname !== myOauthName) {
              sendReadAck(body.id);
            }
          } catch (e) {
            console.error("메시지 처리 오류", e);
          }
        });

        // 읽음 확인 구독
        client.subscribe(`/user/sub/chat/read/${roomId}`, (message: IMessage) => {
          try {
            const ack = JSON.parse(message.body);
            console.log("읽음 확인 수신:", ack);
          } catch (e) {
            console.error("ACK 파싱 오류", e);
          }
        });
      },
      onStompError: frame => {
        console.error("[STOMP ERROR]", frame.headers["message"], frame.body);
      },
      onWebSocketClose: event => {
        console.warn("[STOMP] WebSocket closed:", event);
      },
      onWebSocketError: event => {
        console.error("[STOMP] WebSocket error:", event);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      console.log("[STOMP] 연결 해제");
      client.deactivate();
    };
  }, [accessToken, roomId]);

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 메시지 전송
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

  // 읽음 ACK 전송 helper
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
      {/* 메시지 리스트 */}
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
              {/* 상대방 메시지에만 실제 닉네임 표시 */}
              {msg.senderNickname !== myOauthName && (
                <div className="text-xs text-gray-500 mb-1">
                  {userMap[msg.senderNickname] ?? msg.senderNickname}
                </div>
              )}

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
      <div className="flex justify-between bg-gray-50 px-4 py-2 text-sm border-t border-gray-300">
        <button
          onClick={handleScheduleSuggestion}
          className="text-purple-600 font-medium hover:underline"
        >
          AI 일정 추천
        </button>
        <button
          onClick={handleScheduleReserve}
          className="text-blue-600 font-medium hover:underline"
        >
          일정 등록
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
