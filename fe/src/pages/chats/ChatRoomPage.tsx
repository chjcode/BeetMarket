import { useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Icon } from "@/shared/ui/Icon";

interface ChatMessageResponse {
  id: string;
  roomId: number;
  senderNickname: string;
  type: "TEXT" | "IMAGE";
  content: string;
  timestamp: string;
}

interface Props {
  roomId: number;
  myNickname: string;
  counterpartNickname: string;
}

const ChatRoomPage = ({ roomId, myNickname, counterpartNickname }: Props) => {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<Client | null>(null);
  const accessToken = localStorage.getItem("accessToken") ?? "";
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(
          `https://k12a307.p.ssafy.io//ws-chat?access-token=${accessToken}`
        ),
      reconnectDelay: 5000,
      debug: (msg) => console.log("[STOMP]", msg),
      onConnect: () => {
        console.log("STOMP connected");

        // 메시지 수신 구독
        client.subscribe(
          `/user/${myNickname}/sub/chat/room/${roomId}`,
          (message: IMessage) => {
            const body: ChatMessageResponse = JSON.parse(message.body);
            setMessages((prev) => [...prev, body]);

            if (body.senderNickname === counterpartNickname) {
              sendReadAck(body.id);
            }
          }
        );

        // 읽음 확인 구독
        client.subscribe(
          `/user/${myNickname}/sub/chat/read/${roomId}`,
          (message: IMessage) => {
            const ack = JSON.parse(message.body);
            console.log("읽음 확인 수신:", ack);
          }
        );
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [accessToken, roomId, myNickname, counterpartNickname]);

  const sendMessage = () => {
    if (!input.trim() || !clientRef.current?.connected) return;

    const payload = {
      roomId,
      receiverNickname: counterpartNickname,
      type: "TEXT",
      content: input.trim(),
    };

    clientRef.current.send("/pub/chat/message", {}, JSON.stringify(payload));
    setInput("");
  };

  const sendReadAck = (messageId: string) => {
    if (!clientRef.current?.connected) return;

    const ackPayload = {
      roomId,
      counterpartNickname,
      lastReadMessageId: messageId,
    };

    clientRef.current.send("/pub/chat/read", {}, JSON.stringify(ackPayload));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderNickname === myNickname
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-xl max-w-[70%] text-sm ${
                msg.senderNickname === myNickname
                  ? "bg-purple-200 text-right"
                  : "bg-gray-200 text-left"
              }`}
            >
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
    </div>
  );
};

export default ChatRoomPage;
