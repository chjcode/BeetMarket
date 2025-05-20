import { useEffect, useRef, useState } from "react";
// import { Client, IMessage } from "@stomp/stompjs";
import { Client } from "@stomp/stompjs";
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

  // const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [messages] = useState<ChatMessageResponse[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);

  const [suggestedSchedule, setSuggestedSchedule] = useState<{
    schedule: string;
    location: string;
  } | null>(null);

  const handleChatHealthCheck = async () => {
    try {
      const res = await axiosInstance.get(
        "https://beet.joonprac.shop:8700/api/chat-health"
      );
      console.log("✅ 서버 상태 응답:", res.data);
    } catch (err) {
      console.error("❌ 서버 상태 확인 실패:", err);
    }
  };
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

  // useEffect(() => {
  //   console.log("--- useEffect 시작 ---");
  //   console.log("[디버깅] 현재 roomId:", roomId, "(타입:", typeof roomId, ")");
  //   console.log("[디버깅] 현재 accessToken:", accessToken ? `토큰 길이 ${accessToken.length}` : "토큰 없음 또는 빈 문자열");

  //   if (!roomId || Number(roomId) === 0 || !accessToken || accessToken.trim() === "") {
  //     console.warn("roomId 또는 accessToken이 유효하지 않아 SockJS 연결을 시도하지 않습니다.");
  //     return;
  //   }

  //   const socketUrl = `https://beet.joonprac.shop:8700/ws-chat?access-token=${accessToken}`;
  //   const socket = new SockJS(socketUrl);

  //   socket.onopen = () => console.log("🟢 SockJS 연결 시도");
  //   socket.onclose = (e) => console.warn("🔴 SockJS 연결 종료", e);
  //   socket.onerror = (e) => console.error("❌ SockJS 연결 오류", e);

  //   const client = new Client({
  //     webSocketFactory: () => socket,
  //     reconnectDelay: 5000,
  //     debug: (msg) => console.log("[STOMP]", msg),
  //     connectHeaders: {}, // 헤더는 비워둠 (토큰은 URL에 포함)
  //     forceBinaryWSFrames: false,
  //     appendMissingNULLonIncoming: true,
  //     onConnect: () => {
  //       console.log("✅ STOMP 연결 성공");

  //       client.subscribe(
  //         `/user/sub/chat/room/${roomId}`,
  //         (message: IMessage) => {
  //           try {
  //             const body: ChatMessageResponse = JSON.parse(message.body);
  //             setMessages((prev) => [...prev, body]);
  //             fetchAndCacheNickname(body.senderNickname);
  //             if (body.senderNickname !== myOauthName) {
  //               sendReadAck(body.id);
  //             }
  //           } catch (e) {
  //             console.error("메시지 파싱 오류", e);
  //           }
  //         }
  //       );

  //       client.subscribe(
  //         `/user/sub/chat/read/${roomId}`,
  //         (message: IMessage) => {
  //           try {
  //             const ack = JSON.parse(message.body);
  //             console.log("읽음 확인 수신:", ack);
  //           } catch (e) {
  //             console.error("ACK 파싱 오류", e);
  //           }
  //         }
  //       );
  //     },
  //     onStompError: (frame) => {
  //       console.error("❌ STOMP Error:", frame.headers["message"], frame.body);
  //     },
  //     onWebSocketClose: (event) => {
  //       console.warn("[STOMP] WebSocket closed:", event);
  //     },
  //     onWebSocketError: (event) => {
  //       console.error("[STOMP] WebSocket error:", event);
  //     },
  //   });

  //   client.activate();
  //   console.log("📡 STOMP client.activate() 호출됨");
  //   clientRef.current = client;

  //   return () => {
  //     client.deactivate()
  //     console.log("🛑 STOMP 연결 종료 완료");
  //    };
    
  // }, [accessToken, roomId]);

  useEffect(() => {
    console.log("--- useEffect 시작 ---");
    console.log("[디버깅] 현재 roomId:", roomId, "(타입:", typeof roomId, ")");
    console.log("[디버깅] 현재 accessToken:", accessToken ? `토큰 길이 ${accessToken.length}` : "토큰 없음 또는 빈 문자열");

    if (!roomId || Number(roomId) === 0 || !accessToken || accessToken.trim() === "") {
      console.warn("roomId 또는 accessToken이 유효하지 않아 SockJS 연결을 시도하지 않습니다.");
      return;
    }

    console.log("✅ 연결 사전 조건 통과, SockJS 연결 시도 예정.");
    const socketUrl = `https://beet.joonprac.shop:8700/ws-chat?access-token=${accessToken}`;
    console.log("➡️ 생성될 SockJS URL:", socketUrl);

    try {
      const socket = new SockJS(socketUrl);
      console.log("🟢 SockJS 객체 생성됨:", socket);

      socket.onopen = () => {
        // 이 로그가 찍히면 SockJS가 서버의 /info 엔드포인트와 성공적으로 통신했다는 의미
        console.log("✅ SockJS onopen: 연결 준비 완료 (STOMP 연결 시도 가능 상태)");
      };

      socket.onmessage = (e: MessageEvent) => {
        console.log("📦 SockJS onmessage (STOMP 연결 전 데이터 수신 - 거의 발생 안 함):", e.data);
      };

      socket.onclose = (e: CloseEvent) => {
        console.warn("🔴 SockJS onclose: 연결 종료됨.", "이벤트 객체:", e);
        if (e) {
          console.warn(`  SockJS 상세 종료 정보 - 코드: ${e.code}, 이유: "${e.reason}", 정상 종료 여부: ${e.wasClean}`);
        }
      };

      socket.onerror = (e: Event) => { // SockJS 자체의 에러 핸들러
        console.error("❌ SockJS onerror: 오류 발생.", "오류 이벤트:", e);
      };

      console.log("🧠 STOMP 클라이언트 인스턴스 생성 시도...");
      const client = new Client({
        webSocketFactory: () => {
          console.log("🏭 STOMP webSocketFactory 호출됨 - SockJS 인스턴스를 STOMP에 제공합니다.");
          return socket; // SockJS 인스턴스를 반환
        },
        reconnectDelay: 5000,
        debug: (msg: string) => {
          console.log("[STOMP DEBUG]", msg);
        },
        onConnect: () => {
          console.log("✅ STOMP onConnect: STOMP 프로토콜 연결 성공!");
          // 기존 구독 로직 ...
        },
        onStompError: (frame) => {
          console.error("❌ STOMP onStompError:", "에러 메시지:", frame.headers['message'], "본문:", frame.body, "전체 프레임:", frame);
        },
        onWebSocketClose: (event: CloseEvent) => { // StompJS가 인지하는 웹소켓 종료
          console.warn("🟡 STOMP onWebSocketClose: 웹소켓 연결 종료됨 (STOMP 레벨).", "이벤트:", event);
          if (event && typeof event.code !== 'undefined') { // CloseEvent 객체인지 확인
              console.warn(`  STOMP 인식 WS 상세 종료 정보 - 코드: ${event.code}, 이유: "${event.reason}", 정상 종료 여부: ${event.wasClean}`);
          }
        },
        onWebSocketError: (event: unknown) => { // StompJS가 인지하는 웹소켓 오류
          console.error("💥 STOMP onWebSocketError: 웹소켓 오류 (STOMP 레벨).", "오류 이벤트:", event);
        }
      });

      console.log("🚀 STOMP 클라이언트 활성화 시도 (client.activate())...");
      client.activate();
      clientRef.current = client;
      console.log("👍 STOMP 클라이언트 활성화 완료 및 ref에 저장됨.");

    } catch (error) {
      console.error("💥💥💥 SockJS 또는 STOMP 설정 중 치명적인 예외 발생:", error);
    }

    return () => {
      console.log("--- useEffect 클린업 ---");
      if (clientRef.current && clientRef.current.active) {
        console.log("🧹 STOMP 클라이언트 비활성화 시도...");
        clientRef.current.deactivate();
        console.log("🧼 STOMP 클라이언트 비활성화 완료.");
      } else {
          console.log("🧽 STOMP 클라이언트가 활성화되어 있지 않거나 존재하지 않아 비활성화하지 않음.");
      }
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

  // const sendReadAck = (messageId: string) => {
  //   if (!clientRef.current?.connected) return;
  //   clientRef.current.publish({
  //     destination: "/pub/chat/read",
  //     body: JSON.stringify({
  //       roomId,
  //       counterpartNickname: counterpartOauthName,
  //       lastReadMessageId: messageId,
  //     }),
  //   });
  // };

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
        <button
          onClick={handleChatHealthCheck}
          className="text-green-600 font-medium hover:underline"
        >
          🩺 서버 상태 확인
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
