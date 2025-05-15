import { ChatRoom } from "@/entities/Chat/types";
import { useNavigate } from "react-router-dom";

interface Props {
  chat: ChatRoom;
}

const ChatListItem = ({ chat }: Props) => {
	const navigate = useNavigate();
	
  return (
    <div
      className="w-full h-[80px] flex items-center gap-4 hover:bg-gray-50 cursor-pointer"
      onClick={() => navigate(`/chats/${chat.chatRoomId}`)}
    >
      <img
        src={chat.profileImage}
        alt="프로필"
        className="w-14 h-14 rounded-full object-contain shadow-sm"
      />
      <div className="flex-1">
        <div className="flex justify-between">
          <div className="font-semibold">{chat.nickname}</div>
          <div className="text-xs text-gray-500">
            {new Date(chat.sentAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-sm text-gray-600 truncate max-w-[200px]">
            {chat.lastMessage}
          </div>
          {chat.unreadCount > 0 && (
            <div className="text-xs bg-red-600 text-white  px-2 py-0.5 rounded-full">
              {chat.unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
