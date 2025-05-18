import axiosInstance from "@/shared/api/axiosInstance";
import { ChatRoom } from "./types";

interface ChatRoomResponse {
  chatRooms: ChatRoom[];
  hasNext: boolean;
  nextCursor?: string;
}

export const fetchChatRooms = async ({ pageParam = null }): Promise<ChatRoomResponse> => {
  const res = await axiosInstance.get("/api/chat/rooms", {
    params: pageParam ? { cursor: pageParam } : {},
  });

  return res.data.content;
};
