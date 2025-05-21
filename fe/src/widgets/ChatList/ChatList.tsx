import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchChatRooms, ChatRoomResponse } from "@/entities/Chat/api";
import ChatListItem from "./ChatListItem";
import { useRef, useEffect } from "react";
import type { InfiniteData } from "@tanstack/react-query";

const ChatList = () => {
  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    ChatRoomResponse,                // queryFn 반환 타입
    Error,                           // error 타입
    InfiniteData<ChatRoomResponse>, // ✅ 실제 data 타입
    string[],                        // queryKey 타입
    string | null                   // pageParam 타입
  >({
    queryKey: ["chatRooms"],
    queryFn: fetchChatRooms,
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : null,
  });

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) return <div>로딩중</div>;
  if (isError) return <div>에러</div>;

  return (
    <div className="pt-2 px-4">
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.chatRooms.map((chat) => (
            <ChatListItem key={chat.roomId} chat={chat} />
          ))}
        </div>
      ))}
      <div ref={observerRef} className="h-8" />
      {isFetchingNextPage && <div>다음 페이지 로딩중...</div>}
    </div>
  );
};

export default ChatList;
