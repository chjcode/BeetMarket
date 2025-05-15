import { useQuery } from "@tanstack/react-query";
import { fetchChatRooms } from "@/entities/Chat/api";
import ChatListItem from "./ChatListItem";

const ChatList = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: fetchChatRooms,
  });

  if (isPending) return <div>로딩중</div>;
  if (isError) return <div>에러</div>;

  return (
    <div className="pt-2">
      {data?.map((chat) => (
        <ChatListItem key={chat.chatRoomId} chat={chat} />
      ))}
    </div>
  );
};

export default ChatList;
