import { useRef, useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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

interface LocationState {
  roomId: number;
  opponentUserNickname: string | null;
  opponentUserProfileImageUrl: string | null;
  opponentOauthName: string | null;
}

export const ChatRoomPage2 = () => {
  const { id: paramId } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as LocationState) || null;

  const roomId = state?.roomId ?? Number(paramId);
  const opponentUserNickname = state?.opponentUserNickname ?? "";
  const opponentUserProfileImageUrl = state?.opponentUserProfileImageUrl;
  const opponentOauthName = state?.opponentOauthName ?? "";

  const token = localStorage.getItem("accessToken") ?? "";

  const [status, setStatus] = useState<
    "연결전" | "연결중" | "연결됨" | "연결끊김" | "에러"
  >("연결전");
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessageResponse[]>([]);
  const [opponentLastReadMessageId, setOpponentLastReadMessageId] = useState<
    string | null
  >(null);

  const [suggestedSchedule, setSuggestedSchedule] = useState<string | null>(
    null
  );
  const [suggestedLocation, setSuggestedLocation] = useState<string | null>(
    null
  );

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/chat/rooms/${roomId}/messages`
        );
        const content = res.data.content;
        const data: ChatMessageResponse[] = content.messages.content;
        setChatMessages(data);
        setOpponentLastReadMessageId(
          content.opponentLastReadInfo?.lastReadMessageId ?? null
        );
      } catch (err) {
        console.error("메시지 불러오기 실패", err);
      }
    };
    if (roomId) fetchMessages();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (!token || !roomId || status !== "연결전") return;

    const ws = new WebSocket(
      `wss://beet.joonprac.shop:8700/ws-chat?access-token=${encodeURIComponent(
        token
      )}`
    );
    wsRef.current = ws;
    setStatus("연결중");

    ws.onopen = () => {
      setStatus("연결됨");
      ws.send(`CONNECT\naccept-version:1.2\nheart-beat:10000,10000\n\n\u0000`);
    };

    ws.onmessage = (event) => {
      const data = event.data as string;
      if (data.startsWith("CONNECTED")) {
        ws.send(
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

    ws.onerror = (err) => {
      console.error("WebSocket 오류", err);
      setStatus("에러");
    };

    ws.onclose = (event) => {
      console.warn("WebSocket 종료", event.code, event.reason);
      setStatus("연결끊김");
    };

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [roomId, token, status]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !wsRef.current || status !== "연결됨") return;

    const frameBody = JSON.stringify({
      roomId,
      receiverNickname: opponentUserNickname,
      type: "TEXT",
      content: inputMessage,
    });
    const byteLength = new TextEncoder().encode(frameBody).length;
    const frame =
      `SEND\n` +
      `destination:/pub/chat/message\n` +
      `content-type:application/json\n` +
      `content-length:${byteLength}\n\n` +
      `${frameBody}\u0000`;

    wsRef.current.send(frame);
    setInputMessage("");
  };

  const fetchScheduleSuggestion = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/chat/rooms/${roomId}/schedule-suggestion`
      );
      const content = res.data.content;
      setSuggestedSchedule(content.suggestedSchedule);
      setSuggestedLocation(content.suggestedLocation);
      alert(
        `추천 일정: ${content.suggestedSchedule}\n장소: ${content.suggestedLocation}`
      );
    } catch (err) {
      console.error("일정 추천 실패", err);
      alert("일정 추천 요청에 실패했습니다.");
    }
  };

  const reserveSchedule = async () => {
    if (!suggestedSchedule || !suggestedLocation) {
      alert("먼저 일정 추천을 받아주세요.");
      return;
    }

    try {
      const formattedDate = suggestedSchedule
        .replace(/[-:T]/g, "")
        .slice(0, 12); // "2025-05-22T14:00:00" → "202505221400"
      const data = {
        schedule: formattedDate,
        location: suggestedLocation,
      };
      await axiosInstance.patch(`/api/chat/rooms/${roomId}/reserve`, data);
      alert("일정이 성공적으로 추가되었습니다.");
    } catch (err) {
      console.error("일정 추가 실패", err);
      alert("일정 추가 요청에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center p-4 border-b">
        <button onClick={() => navigate(-1)} className="mr-4 text-xl">
          ‹
        </button>
        <img
          src={opponentUserProfileImageUrl ?? "/default-profile.png"}
          alt="프로필"
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="font-semibold">
          {opponentUserNickname || "알 수 없음"}
        </span>
        <span className="ml-auto text-xs text-gray-500">
          {status}
          {status === "연결끊김" && (
            <button
              onClick={() => setStatus("연결전")}
              className="ml-2 underline text-blue-500 text-xs"
            >
              다시 연결
            </button>
          )}
        </span>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2 bg-gray-50">
        {chatMessages.map((msg, idx) => {
          const isMine = msg.senderNickname !== opponentOauthName;
          const showUnread =
            isMine &&
            opponentLastReadMessageId &&
            Number(msg.id) > Number(opponentLastReadMessageId);
          return (
            <div
              key={idx}
              className={`flex flex-col ${
                isMine ? "items-end" : "items-start"
              }`}
            >
              <div className="flex items-end">
                {!isMine && (
                  <img
                    src={opponentUserProfileImageUrl ?? "/default-profile.png"}
                    alt="프로필"
                    className="w-6 h-6 rounded-full mr-2"
                  />
                )}
                <div
                  className={`px-3 py-2 rounded-lg max-w-[60%] whitespace-pre-wrap ${
                    isMine
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
                {showUnread && (
                  <div className="text-xs bg-red-500 text-white px-1 rounded-full ml-1">
                    1
                  </div>
                )}
              </div>
              <div
                className={`text-gray-500 text-xs mt-1 ${
                  isMine ? "text-right" : "text-left"
                }`}
              >
                {dayjs(msg.timestamp).format("HH:mm")}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t flex flex-col gap-2">
        <div className="flex">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none"
            placeholder="메시지를 입력하세요"
          />
          <button
            onClick={sendMessage}
            className="px-4 bg-blue-500 text-white rounded-r-lg"
          >
            전송
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchScheduleSuggestion}
            className="flex-1 px-3 py-2 bg-green-500 text-white rounded"
          >
            일정 추천
          </button>
          <button
            onClick={reserveSchedule}
            className="flex-1 px-3 py-2 bg-purple-500 text-white rounded"
          >
            일정 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage2;
