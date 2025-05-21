import { useRef, useState } from "react";
import dayjs from "dayjs";

export const ChatRoomPage2 = () => {
  const [status, setStatus] = useState<'연결전' | '연결중' | '연결됨' | '연결끊김' | '에러'>('연결전');
  const [logs, setLogs] = useState<string[]>([]);
  const [token, setToken] = useState<string>('');

  const wsRef = useRef<WebSocket | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `${dayjs().format('HH:mm:ss')} - ${msg}`]);
  };

  const connect = () => {
    if (!token) {
      addLog('access-token이 비어있습니다.');
      return;
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      addLog('이미 연결되어 있습니다.');
      return;
    }
    setStatus('연결중');
    addLog(`WebSocket 접속 시도: wss://beet.joonprac.shop:8700/ws-chat?access-token=${token}`);
    const ws = new WebSocket(`wss://beet.joonprac.shop:8700/ws-chat?access-token=${encodeURIComponent(token)}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('연결됨');
      addLog('WebSocket 연결 성공');
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

  return (
    <div className="p-4">
      <div className="mb-4">
        <label>Access Token:</label>
        <input
          type="text"
          value={token}
          onChange={e => setToken(e.target.value)}
          className="ml-2 px-2 py-1 border rounded w-64"
        />
      </div>

      <div className="mb-4">
        <span className="font-bold">상태:</span> <span className="ml-2">{status}</span>
      </div>

      <div className="mb-4 space-x-2">
        <button onClick={connect} className="px-4 py-1 bg-green-500 text-white rounded">연결</button>
        <button onClick={disconnect} className="px-4 py-1 bg-red-500 text-white rounded">연결끊기</button>
      </div>

      <div className="h-64 overflow-y-auto bg-gray-100 p-2 text-xs">
        {logs.map((log, idx) => (<div key={idx}>{log}</div>))}
      </div>
    </div>
  );
};

export default ChatRoomPage2;
