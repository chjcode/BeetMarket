import { useRef, useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import axiosInstance from "@/shared/api/axiosInstance";
import { Icon } from "@/shared/ui/Icon";

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

export const ChatRoomPage3 = () => {
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

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendReadAck = (lastReadMessageId: string) => {
    if (!wsRef.current || status !== "연결됨") return;

    const frameBody = JSON.stringify({
      roomId,
      counterpartNickname: opponentUserNickname,
      lastReadMessageId,
    });

    const byteLength = new TextEncoder().encode(frameBody).length;
    const frame =
      `SEND\n` +
      `destination:/pub/chat/read\n` +
      `content-type:application/json\n` +
      `content-length:${byteLength}\n\n` +
      `${frameBody}\u0000`;

    wsRef.current.send(frame);
  };

  // ✅ WebSocket 연결
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

          if (parsed.senderNickname === opponentOauthName) {
            sendReadAck(parsed.id); // 수신 즉시 읽음 처리
          }
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

  // ✅ 이전 메시지 로딩 + 입장 시 읽음 처리
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/chat/rooms/${roomId}/messages`
        );
        const content = res.data.content;
        const data: ChatMessageResponse[] = content.messages.content;

        const reversed = [...data].reverse();
        setChatMessages(reversed);

        setOpponentLastReadMessageId(
          content.opponentLastReadInfo?.lastReadMessageId ?? null
        );

        // ✅ 상대방이 보낸 마지막 메시지 읽음 처리
        const lastFromOpponent = reversed
          .slice()
          .reverse()
          .find((msg) => msg.senderNickname === opponentOauthName);
        if (lastFromOpponent) {
          sendReadAck(lastFromOpponent.id);
        }
      } catch (err) {
        console.error("메시지 불러오기 실패", err);
      }
    };

    if (roomId && status === "연결됨") {
      fetchMessages();
    }
  }, [roomId, status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !wsRef.current || status !== "연결됨") return;

    const frameBody = JSON.stringify({
      roomId,
      receiverNickname: opponentUserNickname,
      type: "TEXT",
      content: inputMessage.trim(),
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

  return (
    <div className="flex flex-col h-screen">
      <div className="h-[54px] flex items-center justify-between px-4">
        <div
          className="flex w-[36px] h-[36px] justify-start items-center cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <Icon name="back" className="w-6 h-6 stroke-[0.5]" />
        </div>
        <div className="font-semibold pt-1">{opponentUserNickname}</div>
        <div></div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">
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
                    className="w-10 h-10 rounded-full mr-2"
                  />
                )}
                <div
                  className={`px-3 py-2 rounded-xl${
                    isMine
                      ? "bg-[#f3d6f7] rounded-br-none"
                      : "bg-white rounded-bl-none border border-gray-700"
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
                className={`text-xs mt-1 ${
                  isMine ? "text-left" : "text-right"
                }`}
              >
                {dayjs(msg.timestamp).format("HH:mm")}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="h-[54px] flex flex-col gap-2 bg-white justify-center">
        <div className="flex w-full h-[80%] px-2 items-center justify-between">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="w-[90%] px-3 py-2 bg-gray-100 border border-gray-400 rounded-full focus:outline-none"
            placeholder="메시지 입력하기"
          />
          <button
            onClick={sendMessage}
            className="w-[40px] h-[40px] bg-purple-400 text-white rounded-full flex items-center justify-center ml-2"
          >
            <Icon name="send" className="w-5 h-5 stroke-[0.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage3;
