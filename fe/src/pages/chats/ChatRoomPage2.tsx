import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useParams } from "react-router-dom";

interface ChatMessageResponse {
  id: string;
  roomId: number;
  senderNickname: string;
  type: "TEXT" | "IMAGE";
  content: string;
  timestamp: string;
}

export const ChatRoomPage2 = () => {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const myNickname = localStorage.getItem("myNickname") ?? "";
  const counterpartNickname = localStorage.getItem("counterpartNickname") ?? "";
  const accessToken = localStorage.getItem("accessToken") ?? "";

  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'연결전' | '연결중' | '연결됨' | '연결끊김' | '에러'>('연결전');
  const [input, setInput] = useState("");

  const wsRef = useRef<WebSocket | null>(null);
  const lastReadMessageId = useRef<string | null>(null);
  const ackTimer = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${dayjs().format('HH:mm:ss')} - ${msg}`]);
  };

  const connect = () => {
    if (!accessToken || !roomId) {
      addLog('Token 또는 roomId가 없습니다.');
      return;
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      addLog('이미 연결되어 있습니다.');
      return;
    }
    setStatus('연결중');
    addLog(`WebSocket 접속 시도: wss://beet.joonprac.shop:8700/ws-chat?access-token=${accessToken}`);
    const ws = new WebSocket(`wss://beet.joonprac.shop:8700/ws-chat?access-token=${encodeURIComponent(accessToken)}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('연결됨');
      addLog('WebSocket 연결 성공');
      // 필요시 서버 구독 메시지 전송
    };

    ws.onmessage = (event) => {
      try {
        const msg: ChatMessageResponse = JSON.parse(event.data);
        if (msg.roomId !== roomId) return;
        addLog(`메시지 수신: ${msg.senderNickname} -> ${msg.content}`);
        setMessages(prev => [...prev, msg]);
        if (msg.senderNickname === counterpartNickname) {
          lastReadMessageId.current = msg.id;
          if (document.hasFocus()) {
            if (ackTimer.current) clearTimeout(ackTimer.current);
            ackTimer.current = window.setTimeout(sendReadAck, 500);
          }
        }
      } catch (err) {
        addLog('수신 메시지 파싱 오류');
      }
    };

    ws.onerror = (err) => {
      setStatus('에러');
      addLog('WebSocket 에러 발생');
      console.error(err);
    };

    ws.onclose = (evt) => {
      setStatus('연결끊김');
      addLog(`WebSocket 연결 종료 (code=${evt.code})`);
    };
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      addLog('WebSocket 연결 해제 요청');
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      addLog('메시지 전송 실패: 연결 상태 확인');
      return;
    }
    const payload = {
      roomId,
      receiverNickname: counterpartNickname,
      type: "TEXT",
      content: input.trim(),
    };
    wsRef.current.send(JSON.stringify(payload));
    addLog(`메시지 전송: ${payload.content}`);
    // 로컬 메시지 추가
    setMessages(prev => [...prev, {
      id: `local-${Date.now()}`,
      roomId,
      senderNickname: myNickname,
      type: "TEXT",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }]);
    setInput("");
  };

  const sendReadAck = () => {
    if (!lastReadMessageId.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const ackPayload = { roomId, counterpartNickname, lastReadMessageId: lastReadMessageId.current };
    wsRef.current.send(JSON.stringify(ackPayload));
    addLog(`읽음 확인 전송: 메시지ID=${lastReadMessageId.current}`);
  };

  useEffect(() => {
    fetchInitialMessages();
    return () => {
      if (ackTimer.current) clearTimeout(ackTimer.current);
      wsRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(scrollToBottom, [messages]);

  async function fetchInitialMessages() {
    try {
      const res = await axios.get(
        `https://k12a307.p.ssafy.io/api/chat/rooms/${roomId}/messages`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setMessages(res.data);
      addLog('초기 메시지 로드 완료');
    } catch (err) {
      addLog('초기 메시지 로드 실패');
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 상태 및 로그 영역 */}
      <div className="p-4 border-b">
        <span className="font-bold">상태:</span> <span className="ml-2">{status}</span>
        <div className="mt-2 h-24 overflow-y-auto bg-black text-white p-2 text-xs">
          {logs.map((log, i) => (<div key={i}>{log}</div>))}
        </div>
        <div className="mt-2 space-x-2">
          <button onClick={connect} className="px-3 py-1 bg-green-500 text-white rounded">연결</button>
          <button onClick={disconnect} className="px-3 py-1 bg-red-500 text-white rounded">연결끊기</button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.senderNickname === myNickname ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-xl px-4 py-2 max-w-[60%] text-sm whitespace-pre-wrap ${msg.senderNickname === myNickname ?
              'bg-purple-500 text-white' : 'bg-gray-200'}`}>
              {msg.content}
              <div className="text-xs text-right text-gray-500 mt-1">{dayjs(msg.timestamp).format('HH:mm')}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력폼 */}
      <div className="p-2 border-t flex gap-2">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          className="flex-1 px-4 py-2 border rounded"
        />
        <button onClick={sendMessage} className="px-4 py-2 rounded bg-purple-500 text-white font-semibold">전송</button>
      </div>
    </div>
  );
};

export default ChatRoomPage2;
