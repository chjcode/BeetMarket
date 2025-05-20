import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  sender: "me" | "you";
  content: string;
  timestamp: string;
}

const dummyResponses = [
  "안녕하세요!",
  "좋아요~",
  "이번 주말 어때요?",
  "네 알겠습니다.",
  "감사합니다 :)",
  "조심히 오세요!",
];

const getRandomDelay = () => Math.floor(Math.random() * 1) + 1000; //시간 설정

const ChatRoomPage3 = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const responseIndex = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "me",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // 상대방 응답 예약
    if (responseIndex.current < dummyResponses.length) {
      const delay = getRandomDelay();
      timeoutRef.current = setTimeout(() => {
        const responseMessage: ChatMessage = {
          id: Date.now().toString() + "-you",
          sender: "you",
          content: dummyResponses[responseIndex.current],
          timestamp: new Date().toLocaleTimeString(),
        };
        responseIndex.current += 1;
        setMessages((prev) => [...prev, responseMessage]);
      }, delay);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 상단 바 (예: 상대방 이름) */}
      <div className="p-4 bg-white shadow text-lg font-semibold border-b">
        상대방 닉네임
      </div>

      {/* 채팅 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                msg.sender === "me"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-black border rounded-bl-none"
              }`}
            >
              {msg.content}
              <div className="text-[10px] mt-1 text-right opacity-70">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="p-4 bg-white border-t flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 text-sm"
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage3;
