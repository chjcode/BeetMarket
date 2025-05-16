import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  sender: "me" | "other";
  content: string;
  timestamp: string;
}

const data: Message[] = [
  {
    id: 1,
    sender: "other",
    content: "상대방이 보낸 메세지",
    timestamp: "오전 10:00",
  },
  {
    id: 2,
    sender: "me",
    content: "안녕하세요. 문의드릴 게 있어요.",
    timestamp: "오전 10:01",
  },
  {
    id: 3,
    sender: "other",
    content: "네, 말씀해주세요!",
    timestamp: "오전 10:02",
  },
];

const ChatRoomPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {    
    setMessages(data);
  }, []);

  // 채팅 입력 후 보내기
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "me",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // 상대방 응답 더미
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        sender: "other",
        content: "상대방의 메세지",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  // 메시지 전송 후 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen p-4">
      {/* 채팅 메시지 목록 */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded-xl max-w-[70%] text-sm ${
                msg.sender === "me"
                  ? "bg-purple-200 text-right"
                  : "bg-gray-200 text-left"
              }`}
            >
              <div>{msg.content}</div>
              <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-md p-2"
          placeholder="메시지를 입력하세요"
        />
        <button
          onClick={sendMessage}
          className="bg-purple-500 text-white px-4 py-2 rounded-md"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
