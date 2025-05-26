import { ChatRoom } from "./types";
import axiosInstance from "@/shared/api/axiosInstance";

export interface ChatRoomResponse {
  chatRooms: ChatRoom[];
  hasNext: boolean;
  nextCursor: string | null;
}

export const fetchChatRooms = async ({
  pageParam = null,
}: {
  pageParam?: string | null;
}): Promise<ChatRoomResponse> => {
  const res = await axiosInstance.get("/api/chat/rooms", {
    params: pageParam ? { cursor: pageParam } : {},
  });

  return res.data.content;
};
