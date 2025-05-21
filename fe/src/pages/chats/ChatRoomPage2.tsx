// src/pages/chats/ChatRoomPage.tsx
import { useEffect, useRef, useState } from "react";
import { Client, IMessage, IFrame, StompSubscription } from "@stomp/stompjs"; // IFrame, StompSubscription 타입 추가
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

// WebSocket 서버 주소 및 엔드포인트 설정
const WEBSOCKET_PROTOCOL = "wss://"; // EC2 환경이 SSL을 사용하므로 wss
const WEBSOCKET_HOST = "beet.joonprac.shop:8700"; // 실제 웹소켓 호스트 및 포트
const WEBSOCKET_ENDPOINT = "/ws-chat"; // 웹소켓 엔드포인트

export const ChatRoomPage2 = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const myNickname = localStorage.getItem("myNickname") ?? "User" + Math.floor(Math.random() * 1000);
  const counterpartNickname = localStorage.getItem("counterpartNickname") ?? "Opponent";
  const accessToken = localStorage.getItem("accessToken") ?? "";

  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [input, setInput] = useState("");
  const clientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messageSubscriptionRef = useRef<StompSubscription | null>(null);
  const readAckSubscriptionRef = useRef<StompSubscription | null>(null);

  const lastReadMessageIdByMe = useRef<string | null>(null);
  const ackTimer = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchInitialMessages = async () => {
    if (!accessToken) {
      console.warn("AccessToken이 없어 초기 메시지를 불러올 수 없습니다.");
      setMessages([]);
      return;
    }
    try {
      const res = await axios.get<{ result?: { content: ChatMessageResponse[] } }>(
        `https://k12a307.p.ssafy.io/api/chat/rooms/${roomId}/messages`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      console.log("🗃️ 초기 메시지 목록 응답:", res.data);
      if (res.data && res.data.result && Array.isArray(res.data.result.content)) {
        setMessages(res.data.result.content.slice().reverse());
      } else {
        console.warn("초기 메시지 데이터 형식이 올바르지 않거나 데이터가 없습니다.");
        setMessages([]);
      }
    } catch (err) {
      console.error("❌ 초기 메시지 불러오기 실패:", err);
      setMessages([]);
    }
  };

  const connectWebSocket = () => {
    if (!accessToken) {
      console.warn("AccessToken이 없어 WebSocket에 연결할 수 없습니다.");
      return;
    }
    if (clientRef.current && clientRef.current.active) {
      console.log("이미 WebSocket에 연결되어 있습니다.");
      return;
    }

    console.log("순수 WebSocket 연결 시도 중...");
    const brokerURL = `${WEBSOCKET_PROTOCOL}${WEBSOCKET_HOST}${WEBSOCKET_ENDPOINT}?access-token=${accessToken}`;
    console.log("Broker URL:", brokerURL);

    const client = new Client({
      brokerURL: brokerURL,
      connectHeaders: {
        // Authorization: `Bearer ${accessToken}`, // WebSocket 핸드셰이크는 query param으로 인증
      },
      reconnectDelay: 10000,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
      
      debug: (str) => {
        console.log(`STOMP_DEBUG: ${new Date().toISOString()} : ${str}`);
      },

      onConnect: (frame: IFrame) => { // onConnect의 frame도 IFrame 타입
        console.log("✅ Connected to STOMP via Native WebSocket. Frame:", frame);

        if (messageSubscriptionRef.current) messageSubscriptionRef.current.unsubscribe();
        if (readAckSubscriptionRef.current) readAckSubscriptionRef.current.unsubscribe();
        
        messageSubscriptionRef.current = client.subscribe(`/user/sub/chat/room/${roomId}`, (msg: IMessage) => {
          try {
            const body: ChatMessageResponse = JSON.parse(msg.body);
            console.log("📩 메시지 수신:", body);
            setMessages((prevMessages) => [...prevMessages, body]);

            if (body.senderNickname === counterpartNickname && body.senderNickname !== myNickname) {
              lastReadMessageIdByMe.current = body.id;
              if (document.hasFocus()) {
                if (ackTimer.current) clearTimeout(ackTimer.current);
                ackTimer.current = setTimeout(() => sendReadAckToServer(body.id), 700);
              }
            }
          } catch (e) {
            console.error("메시지 처리 중 오류:", e, msg.body);
          }
        });

        readAckSubscriptionRef.current = client.subscribe(`/user/sub/chat/read/${roomId}`, (msg: IMessage) => {
          try {
            const ackData = JSON.parse(msg.body);
            console.log("📬 읽음 확인 수신:", ackData);
          } catch (e) {
            console.error("읽음 확인 처리 중 오류:", e, msg.body);
          }
        });
      },

      onStompError: (frame: IFrame) => { // frame 파라미터 타입을 IFrame으로 수정
        console.error("❌ STOMP 브로커 오류:", frame.headers?.['message'] || 'STOMP Error Frame', frame);
      },
      onWebSocketError: (event: Event) => {
        console.error("❌ WebSocket 연결 오류:", event);
      },
      onWebSocketClose: (event: CloseEvent) => {
        console.log(`❌ WebSocket 연결 닫힘: 코드=${event.code}, 이유=${event.reason || 'N/A'}`);
      },
    });

    client.activate();
    clientRef.current = client;
  };
  
  const sendReadAckToServer = (messageIdToAck: string | null) => {
    if (!messageIdToAck || !clientRef.current?.connected) {
      if (!clientRef.current?.connected) console.warn("읽음 확인 전송 실패: STOMP 클라이언트 미연결");
      return;
    }
    const payload = {
      roomId,
      counterpartNickname,
      lastReadMessageId: messageIdToAck,
    };
    console.log(`✅ 읽음 확인 전송 (메시지 ID: ${messageIdToAck}):`, payload);
    clientRef.current?.publish({
      destination: "/pub/chat/read",
      body: JSON.stringify(payload),
    });
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!clientRef.current?.connected) {
      console.warn("STOMP 클라이언트가 연결되지 않아 메시지를 전송할 수 없습니다.");
      return;
    }
    const payload = {
      roomId,
      receiverNickname: counterpartNickname,
      type: "TEXT" as "TEXT" | "IMAGE",
      content: input.trim(),
    };
    console.log("📤 메시지 전송:", payload);
    clientRef.current?.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(payload),
    });
    setInput("");
  };

  useEffect(() => {
    const handleFocus = () => {
      if (lastReadMessageIdByMe.current && clientRef.current?.connected && document.hasFocus()) {
        console.log("창 포커스됨, 밀린 읽음 상태 전송 시도 (메시지 ID:", lastReadMessageIdByMe.current, ")");
        if (ackTimer.current) clearTimeout(ackTimer.current);
        ackTimer.current = setTimeout(() => sendReadAckToServer(lastReadMessageIdByMe.current), 500);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      if (ackTimer.current) clearTimeout(ackTimer.current);
    };
  }, [roomId, counterpartNickname]);


  useEffect(() => {
    if (roomId && accessToken && myNickname && counterpartNickname) {
      fetchInitialMessages();
      connectWebSocket();
    } else {
      console.warn("채팅방 초기화에 필요한 정보가 부족합니다.", { roomId, accessToken, myNickname, counterpartNickname });
    }

    return () => {
      console.log("ChatRoomPage2 언마운트: WebSocket 연결 해제 시도.");
      if (ackTimer.current) clearTimeout(ackTimer.current);
      if (messageSubscriptionRef.current) {
        messageSubscriptionRef.current.unsubscribe();
        messageSubscriptionRef.current = null;
      }
      if (readAckSubscriptionRef.current) {
        readAckSubscriptionRef.current.unsubscribe();
        readAckSubscriptionRef.current = null;
      }
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
        console.log("WebSocket 클라이언트 비활성화됨.");
      }
      clientRef.current = null;
    };
  }, [roomId, accessToken, myNickname, counterpartNickname]);

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 border-b shadow-sm bg-white sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-purple-700">Chat with {counterpartNickname}</h1>
        <p className="text-xs text-gray-500">My Nickname: {myNickname}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg: ChatMessageResponse) => ( // 타입 명시
          <div
            key={msg.id}
            className={`flex items-end w-full ${
              msg.senderNickname === myNickname
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {msg.senderNickname !== myNickname && (
              <div className="flex items-start max-w-[75%]">
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex-shrink-0 items-center justify-center hidden sm:flex">
                  <span className="text-sm font-bold text-gray-600">{counterpartNickname.substring(0,1).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5 ml-1">{msg.senderNickname}</p>
                  <div className="bg-white text-gray-800 rounded-xl rounded-bl-none px-4 py-2 shadow-md border border-gray-200">
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-1">{dayjs(msg.timestamp).format("HH:mm")}</p>
                </div>
              </div>
            )}
            {msg.senderNickname === myNickname && (
               <div className="flex items-start max-w-[75%] ml-auto">
                <div className="order-2">
                  <div className="bg-purple-600 text-white rounded-xl rounded-br-none px-4 py-2 shadow-md">
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right mr-1">{dayjs(msg.timestamp).format("HH:mm")}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-500 ml-2 flex-shrink-0 items-center justify-center hidden sm:flex order-1">
                  <span className="text-sm font-bold text-white">{myNickname.substring(0,1).toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t bg-gray-50 flex gap-2 items-center sticky bottom-0">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.nativeEvent.isComposing) sendMessage();}}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none shadow-sm"
          disabled={!clientRef.current?.active}
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2.5 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors disabled:opacity-50"
          disabled={!clientRef.current?.active || !input.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage2;