import { useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useParams } from "react-router-dom";
import axiosInstance from "@/shared/api/axiosInstance";
import { Icon } from "@/shared/ui/Icon";
import dayjs from "dayjs";

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

  const myOauthName = localStorage.getItem("myNickname") ?? "";
  const counterpartOauthName =
    localStorage.getItem("counterpartNickname") ?? "";
  const accessToken = localStorage.getItem("accessToken") ?? "";

  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);

  const [suggestedSchedule, setSuggestedSchedule] = useState<{
    schedule: string;
    location: string;
  } | null>(null);

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
    } catch (e) {
      console.error(`닉네임 조회 실패: ${oauthName}`, e);
    }
  };

  useEffect(() => {
    fetchAndCacheNickname(myOauthName);
    fetchAndCacheNickname(counterpartOauthName);
  }, []);

  useEffect(() => {
    console.log("[디버깅] roomId:", roomId);
    console.log("[디버깅] accessToken:", accessToken);
    if (!roomId || !accessToken) return;

    const socketUrl = `wss://beet.joonprac.shop:8700/ws-chat?access-token=${accessToken}`;
    const socket = new SockJS(socketUrl);

    socket.onopen = () => console.log("🟢 SockJS 연결 시도");
    socket.onclose = (e) => console.warn("🔴 SockJS 연결 종료", e);
    socket.onerror = (e) => console.error("❌ SockJS 연결 오류", e);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (msg) => console.log("[STOMP]", msg),
      connectHeaders: {}, // 헤더는 비워둠 (토큰은 URL에 포함)
      forceBinaryWSFrames: false,
      appendMissingNULLonIncoming: true,
      onConnect: () => {
        console.log("✅ STOMP 연결 성공");

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
              console.error("메시지 파싱 오류", e);
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
              console.error("ACK 파싱 오류", e);
            }
          }
        );
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame.headers["message"], frame.body);
      },
      onWebSocketClose: (event) => {
        console.warn("[STOMP] WebSocket closed:", event);
      },
      onWebSocketError: (event) => {
        console.error("[STOMP] WebSocket error:", event);
      },
    });

    client.activate();
    console.log("📡 STOMP client.activate() 호출됨");
    clientRef.current = client;

    return () => {
      client.deactivate()
      console.log("🛑 STOMP 연결 종료 완료");
     };
    
  }, [accessToken, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleScheduleSuggestion = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/chat/rooms/${roomId}/schedule-suggestion`
      );
      const { suggestedSchedule, suggestedLocation } = res.data.content;
      const formatted = dayjs(suggestedSchedule).format("YYYYMMDDHHmmss");
      const payload = {
        schedule: formatted,
        location: suggestedLocation,
      };
      setSuggestedSchedule(payload);
      console.log("✅ 추천 일정 저장됨:", payload);
    } catch (err) {
      console.error("❌ 일정 추천 실패", err);
    }
  };

  const handleScheduleReserve = async () => {
    const scheduleToSend = suggestedSchedule?.schedule ?? "20250601120000";
    const locationToSend = suggestedSchedule?.location ?? "역삼 멀티캠퍼스 3층";

    try {
      const res = await axiosInstance.patch(
        `/api/chat/rooms/${roomId}/reserve`,
        {
          schedule: scheduleToSend,
          location: locationToSend,
        }
      );
      console.log("✅ 일정 등록 성공:", res.data);
    } catch (err) {
      console.error("❌ 일정 등록 실패", err);
    }
  };

  return (
    <div className="flex flex-col h-full">
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
                  hour: "numeric",
                  minute: "numeric",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="py-2 bg-white flex items-center gap-2 px-4 border-t border-gray-300">
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
          🧠 AI 일정 추천
        </button>
        <button
          onClick={handleScheduleReserve}
          className="text-blue-600 font-medium hover:underline"
        >
          📅 일정 등록
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
