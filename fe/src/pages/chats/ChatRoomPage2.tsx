import { useRef, useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import axiosInstance from "@/shared/api/axiosInstance";

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
  const [token, setToken] = useState("");
  const [receiverNickname, setReceiverNickname] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessageResponse[]>([]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/chat/rooms/${roomId}/messages`
        );
        console.log(response.data); // 실제 데이터
        setChatMessages(response.data); // 초기 메시지 설정
      } catch (err) {
        console.error("메시지 불러오기 실패", err);
      }
    };

    if (roomId) {
      fetchMessages();
    }
  }, [roomId]);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `${dayjs().format("HH:mm:ss")} - ${msg}`]);
  };

  const sendRaw = (msg: string) => {
    wsRef.current?.send(msg);
    addLog(`[SEND] ${msg}`);
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
    const ws = new WebSocket(
      `wss://beet.joonprac.shop:8700/ws-chat?access-token=${encodeURIComponent(
        token
      )}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("연결됨");
      addLog("WebSocket 연결 성공");
      sendRaw(`CONNECT\naccept-version:1.2\nheart-beat:10000,10000\n\n\u0000`);
    };

    ws.onmessage = (event) => {
      const data = event.data;
      addLog(`[RECV] ${data}`);

      if (data.startsWith("CONNECTED")) {
        sendRaw(
          `SUBSCRIBE\nid:sub-0\ndestination:/user/sub/chat/room/${roomId}\n\n\u0000`
        );
      } else if (data.startsWith("MESSAGE")) {
        const body = data.split("\n\n")[1].split("\u0000")[0];
        try {
          const parsed: ChatMessageResponse = JSON.parse(body);
          setChatMessages((prev) => [...prev, parsed]);
        } catch (e) {
          console.error("메시지 파싱 실패", e);
        }
      }
    };

    ws.onerror = (e) => {
      setStatus("에러");
      addLog("WebSocket 에러 발생");
      console.error(e);
    };

    ws.onclose = (e) => {
      setStatus("연결끊김");
      addLog(`WebSocket 연결 종료 (code=${e.code})`);
    };
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      addLog("WebSocket 연결 해제 요청");
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const message = {
      roomId,
      receiverNickname,
      type: "TEXT",
      content: inputMessage,
    };
    const body = JSON.stringify(message);
    const frame = `SEND\ndestination:/pub/chat/message\ncontent-type:application/json\ncontent-length:${body.length}\n\n${body}\u0000`;
    sendRaw(frame);
    setInputMessage("");
  };

  return (
    <div className="p-4">
      <div className="mb-2">
        <label>Access Token:</label>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="ml-2 px-2 py-1 border rounded w-64"
        />
      </div>
      <div className="mb-2">
        <label>상대 닉네임:</label>
        <input
          value={receiverNickname}
          onChange={(e) => setReceiverNickname(e.target.value)}
          className="ml-2 px-2 py-1 border rounded w-64"
        />
      </div>
      <div className="mb-4">
        <span className="font-bold">상태:</span>{" "}
        <span className="ml-2">{status}</span>
      </div>

      <div className="mb-2 space-x-2">
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

      <div className="mb-2">
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="w-64 px-2 py-1 border rounded mr-2"
          placeholder="메시지 입력"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-1 bg-blue-500 text-white rounded"
        >
          전송
        </button>
      </div>

      <div className="h-40 overflow-y-auto bg-gray-100 p-2 text-xs mb-4">
        {logs.map((log, idx) => (
          <div key={idx}>{log}</div>
        ))}
      </div>

      <div className="h-64 overflow-y-auto bg-white p-2 border">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <div>
              <b>{msg.senderNickname}</b>: {msg.content}
            </div>
            <div className="text-gray-400 text-xs">
              {dayjs(msg.timestamp).format("HH:mm:ss")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatRoomPage2;
