import { ChatRoom } from "./types";
// import { axiosInstance } from "@/shared/api/axiosInstance";

const data: ChatRoom[] = [
  {
    chatRoomId: "1",
    nickname: "홍길동",
    profileImage: "/profile/profile1.jpg",
    lastMessage: "안녕하세요!",
    sentAt: "2025-05-15T09:12:00Z",
    unreadCount: 3,
  },
  {
    chatRoomId: "2",
    nickname: "김민지",
    profileImage: "/profile/profile2.jpg",
    lastMessage: "점심 먹었어요?",
    sentAt: "2025-05-14T12:45:00Z",
    unreadCount: 0,
  },
  {
    chatRoomId: "3",
    nickname: "이철수",
    profileImage: "/profile/profile3.jpg",
    lastMessage: "회의 시작했어요",
    sentAt: "2025-05-13T18:30:00Z",
    unreadCount: 1,
  },
  {
    chatRoomId: "4",
    nickname: "박영희",
    profileImage: "/profile/profile4.jpg",
    lastMessage: "사진 보냈어요",
    sentAt: "2025-05-12T23:10:00Z",
    unreadCount: 0,
  },
  {
    chatRoomId: "5",
    nickname: "최준호",
    profileImage: "/profile/profile5.jpg",
    lastMessage: "감사합니다!",
    sentAt: "2025-05-10T15:20:00Z",
    unreadCount: 2,
  },
  {
    chatRoomId: "6",
    nickname: "정은지",
    profileImage: "/profile/profile6.jpg",
    lastMessage: "오전 일정 확인 부탁해요",
    sentAt: "2025-05-08T08:00:00Z",
    unreadCount: 0,
  },
  {
    chatRoomId: "7",
    nickname: "강다니엘",
    profileImage: "/profile/profile7.jpg",
    lastMessage: "다음 주에 봬요!",
    sentAt: "2025-05-01T14:00:00Z",
    unreadCount: 4,
  },
  {
    chatRoomId: "8",
    nickname: "이수지",
    profileImage: "/profile/profile8.jpg",
    lastMessage: "파일 전송 완료했습니다.",
    sentAt: "2025-04-25T10:30:00Z",
    unreadCount: 0,
  },
  {
    chatRoomId: "9",
    nickname: "남도현",
    profileImage: "/profile/profile9.jpg",
    lastMessage: "출발했어요!",
    sentAt: "2025-04-18T17:45:00Z",
    unreadCount: 1,
  },
  {
    chatRoomId: "10",
    nickname: "고윤아",
    profileImage: "/profile/profile10.jpg",
    lastMessage: "문서 검토 완료했어요",
    sentAt: "2025-03-30T09:15:00Z",
    unreadCount: 0,
  },
  {
    chatRoomId: "11",
    nickname: "서지훈",
    profileImage: "/profile/profile11.jpg",
    lastMessage: "이번 주 일정 어때요?",
    sentAt: "2024-12-15T13:00:00Z",
    unreadCount: 5,
  },
  {
    chatRoomId: "12",
    nickname: "한예슬",
    profileImage: "/profile/profile12.jpg",
    lastMessage: "새해 복 많이 받으세요!",
    sentAt: "2024-01-01T00:00:00Z",
    unreadCount: 0,
  },
];

// export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
//   const response = await axiosInstance.get("/api/chatrooms");
//   return response.data;
// };

//axios 주소 다를듯
// export const getMessages = async (chatRoomId: string): Promise<ChatMessage[]> => {
//   const response = await axiosInstance.get(`/api/chats/${chatRoomId}/messages`);
//   return response.data;
// };

export const fetchChatRooms = async (): Promise<ChatRoom[]> => {
  return data;
};
