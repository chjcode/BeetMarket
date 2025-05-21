import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";

interface ChatMessageResponse {
  id: string;
  roomId: number;
  senderNickname: string;
  type: "TEXT" | "IMAGE";
  content: string;
  timestamp: string;
}

const ChatRoomPage2 = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);

  const [status, setStatus] = useState<
    "연결전" | "연결중" | "연결됨" | "연결끊김" | "에러"
  >("연결전");
  const [logs, setLogs] = useState<string[]>([]);
  const [token, setToken] = useState<string>("");
  const [myNickname, setMyNickname] = useState<string>("me");
  const [receiverNickname, setReceiverNickname] = useState<string>("you");

  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [input, setInput] = useState("");

  const wsRef = useRef<WebSocket | null>(null);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `${dayjs().format("HH:mm:ss")} - ${msg}`]);
  };

  const connect = () => {
    if (!token) {
      addLog("access-token이 비어있습니다.");
      return;
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      addLog("이미 연결되어 있습니다.");
      return;
    }

    setStatus("연결중");
    addLog(
      `WebSocket 접속 시도: wss://beet.joonprac.shop:8700/ws-chat?access-token=${token}`
    );
    const ws = new WebSocket(
      `wss://beet.joonprac.shop:8700/ws-chat?access-token=${encodeURIComponent(
        token
      )}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("연결됨");
      addLog("WebSocket 연결 성공");
    };

    ws.onerror = (err) => {
      setStatus("에러");
      addLog("WebSocket 에러 발생");
      console.error(err);
    };

    ws.onclose = (evt) => {
      setStatus("연결끊김");
      addLog(`WebSocket 연결 종료 (code=${evt.code})`);
    };

    ws.onmessage = (event) => {
      try {
        const data: ChatMessageResponse = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
        addLog(`메시지 수신: ${data.content}`);
      } catch (e) {
        addLog("수신 데이터 파싱 실패");
      }
    };
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      addLog("WebSocket 연결 해제 요청");
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const payload = {
      roomId,
      receiverNickname,
      type: "TEXT",
      content: input,
    };
    wsRef.current?.send(JSON.stringify(payload));
    addLog(`메시지 전송: ${input}`);
    setInput("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <div className="space-y-2">
        <label>Access Token:</label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full px-2 py-1 border rounded"
        />
        <label>내 닉네임:</label>
        <input
          type="text"
          value={myNickname}
          onChange={(e) => setMyNickname(e.target.value)}
          className="w-full px-2 py-1 border rounded"
        />
        <label>상대 닉네임:</label>
        <input
          type="text"
          value={receiverNickname}
          onChange={(e) => setReceiverNickname(e.target.value)}
          className="w-full px-2 py-1 border rounded"
        />
      </div>

      <div className="font-bold">
        상태: <span className="text-blue-600">{status}</span>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={connect}
          className="px-4 py-1 bg-green-500 text-white rounded"
        >
          연결
        </button>
        <button
          onClick={disconnect}
          className="px-4 py-1 bg-red-500 text-white rounded"
        >
          연결끊기
        </button>
      </div>

      <div className="border p-2 h-64 overflow-y-auto bg-gray-100 rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              msg.senderNickname === myNickname ? "text-right" : "text-left"
            }
          >
            <span className="block text-sm">
              <strong>{msg.senderNickname}</strong>: {msg.content}
            </span>
            <span className="text-[10px] text-gray-500">
              {dayjs(msg.timestamp).format("HH:mm:ss")}
            </span>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-2 py-1 border rounded"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-1 bg-blue-500 text-white rounded"
        >
          전송
        </button>
      </div>

      <div className="border p-2 h-40 overflow-y-auto bg-gray-50 text-xs rounded">
        {logs.map((log, idx) => (
          <div key={idx}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomPage2;
