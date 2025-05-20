import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketTestPage = () => {
  useEffect(() => {
    const accessToken = "your-access-token"; // 필요한 경우 수정
    const socketUrl = `https://beet.joonprac.shop:8700/ws-chat?access-token=${accessToken}`;
    // const socketUrl = `https://beet.joonprac.shop:8700/ws-chat?access-token=1111}`;
    const socket = new SockJS(socketUrl);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (msg) => console.log("[STOMP DEBUG]", msg),
      onConnect: () => {
        console.log("✅ STOMP 연결 성공");
        // 구독 등 테스트 로직은 여기에 추가 가능
      },
      onStompError: (frame) => {
        console.error(
          "❌ STOMP 오류 발생:",
          frame.headers["message"],
          frame.body
        );
      },
      onWebSocketClose: (event) => {
        console.warn("🛑 WebSocket 닫힘", event);
      },
      onWebSocketError: (event) => {
        console.error("❗ WebSocket 오류", event);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
      console.log("📴 연결 종료");
    };
  }, []);

  return <div className="p-8 text-xl">🔌 웹소켓 연결 테스트 중입니다...</div>;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WebSocketTestPage />
  </React.StrictMode>
);
