import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

interface ChatMessageResponse {
  messageId: string;
  roomId: number;
  senderNickname: string;
  receiverNickname: string;
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

const WS_HOST = "https://beet.joonprac.shop:8700";
const WS_ENDPOINT = "/ws-chat";

const ChatRoomPage = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);

  const [accessToken] = useState(localStorage.getItem("accessToken") ?? "");
  const [myNick] = useState(localStorage.getItem("myNickname") ?? "");
  const [counterpartNick] = useState(
    localStorage.getItem("counterpartNickname") ?? ""
  );

  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [input, setInput] = useState("");
  const [type, setType] = useState<"TEXT" | "IMAGE">("TEXT");
  const [status, setStatus] = useState<"connected" | "disconnected" | "error">(
    "disconnected"
  );
  const [logs, setLogs] = useState<string[]>([]);

  const stompClientRef = useRef<Client | null>(null);
  const lastSeenMessageIdRef = useRef<string | null>(null);
  const ackTimer = useRef<NodeJS.Timeout | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connect = () => {
    const socket = new SockJS(
      `${WS_HOST}${WS_ENDPOINT}?access-token=${encodeURIComponent(accessToken)}`
    );
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 3000,
      onConnect: () => {
        setStatus("connected");
        addLog("✅ STOMP 연결 성공");

        client.subscribe(
          `/user/sub/chat/room/${roomId}`,
          (message: IMessage) => {
            const data: ChatMessageResponse = JSON.parse(message.body);
            setMessages((prev) => [...prev, data]);

            if (data.senderNickname === counterpartNick) {
              lastSeenMessageIdRef.current = data.messageId;
              debounceSendReadAck();
            }
          }
        );

        client.subscribe(
          `/user/sub/chat/read/${roomId}`,
          (message: IMessage) => {
            const ack: ReadAckResponse = JSON.parse(message.body);
            addLog(
              `📩 ${ack.readerNickname}가 메시지 ${ack.lastReadMessageId}까지 읽음`
            );
          }
        );
      },
      onDisconnect: () => {
        setStatus("disconnected");
        addLog("❎ 연결이 끊겼습니다.");
      },
      onStompError: (error) => {
        setStatus("error");
        addLog(`❌ STOMP 에러: ${error.headers?.message}`);
      },
    });

    client.activate();
    stompClientRef.current = client;
  };
  

  const disconnect = () => {
    stompClientRef.current?.deactivate();
    stompClientRef.current = null;
    setStatus("disconnected");
    addLog("🔌 연결 해제됨");
  };

  const sendMessage = () => {
    if (!input.trim() || !stompClientRef.current?.connected) return;

    const payload = {
      roomId,
      receiverNickname: counterpartNick,
      type,
      content: input.trim(),
    };

    stompClientRef.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify(payload),
    });

    setInput("");
  };

  const debounceSendReadAck = () => {
    if (ackTimer.current) clearTimeout(ackTimer.current);
    ackTimer.current = setTimeout(() => {
      const lastId = lastSeenMessageIdRef.current;
      if (lastId && stompClientRef.current?.connected) {
        stompClientRef.current.publish({
          destination: "/pub/chat/read",
          body: JSON.stringify({
            roomId,
            counterpartNickname: counterpartNick,
            lastReadMessageId: lastId,
          }),
        });
        addLog(`🟢 읽음처리 전송 (ID: ${lastId})`);
      }
    }, 500);
  };

  useEffect(() => {
    const handleFocus = () => {
      if (stompClientRef.current?.connected) debounceSendReadAck();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">🧪 채팅 테스트 (STOMP)</h2>

      <div className="mb-4">
        <div className="mb-2 text-sm text-gray-600">상태: {status}</div>
        <div className="flex gap-2 mb-2">
          <button
            onClick={connect}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            연결
          </button>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            끊기
          </button>
        </div>
      </div>

      <div className="mb-4 h-64 overflow-y-auto border rounded p-2 bg-gray-50 text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1">
            <span className="font-bold text-indigo-600">
              {msg.senderNickname}
            </span>
            : {msg.content}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "TEXT" | "IMAGE")}
          className="border px-2 py-1 rounded"
        >
          <option value="TEXT">TEXT</option>
          <option value="IMAGE">IMAGE</option>
        </select>
        <input
          type="text"
          className="flex-1 border px-3 py-1 rounded"
          placeholder="메시지 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          전송
        </button>
      </div>

      <div className="text-xs text-gray-400 h-28 overflow-y-auto border rounded p-2 bg-gray-50">
        {logs.map((log, idx) => (
          <div key={idx}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomPage;
