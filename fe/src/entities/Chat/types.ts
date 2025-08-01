export interface ChatRoom {
  roomId: string;
  opponentUserNickname: string | null;
  opponentUserProfileImageUrl: string | null;
  opponentOauthName: string | null;
  lastMessageContent: string;
  lastMessageTimestamp: string;
  unreadMessageCount: number;
  postId: number;
}
