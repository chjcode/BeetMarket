import { useState } from "react";

const ChatListPage = () => {
  const [filter, setFilter] = useState<"전체" | "구매" | "판매">("전체");

  const filters = ["전체", "구매", "판매"] as const;

  { /* dummy data */}
  const chatRooms = [
    {
      name: "김철수",
      profileUrl: "https://randomuser.me/api/portraits/men/11.jpg",
      message: "안녕하세요! 거래 가능할까요?",
      time: "1시간 전",
      unread: 0,
      filter: "구매"
    },
    {
      name: "이영희",
      profileUrl: "https://randomuser.me/api/portraits/women/22.jpg",
      message: "상품 수령했습니다. 감사합니다.",
      time: "2시간 전",
      unread: 2,
      filter: "판매"
    },
    {
      name: "박민수",
      profileUrl: "https://randomuser.me/api/portraits/men/33.jpg",
      message: "혹시 에눌 가능한가요?",
      time: "30분 전",
      unread: 1,
      filter: "구매"
    },
    {
      name: "최지우",
      profileUrl: "https://randomuser.me/api/portraits/women/44.jpg",
      message: "사진 좀 더 보내주실 수 있나요?",
      time: "12시간 전",
      unread: 0,
      filter: "구매"
    },
    {
      name: "정은지",
      profileUrl: "https://randomuser.me/api/portraits/women/55.jpg",
      message: "직거래 어디서 가능할까요?",
      time: "5시간 전",
      unread: 3,
      filter: "판매"
    },
    {
      name: "오세훈",
      profileUrl: "https://randomuser.me/api/portraits/men/66.jpg",
      message: "오늘 거래 가능하신가요?",
      time: "3분 전",
      unread: 5,
      filter: "판매"
    },
    {
      name: "윤가영",
      profileUrl: "https://randomuser.me/api/portraits/women/77.jpg",
      message: "죄송한데 취소 가능할까요?",
      time: "어제",
      unread: 0,
      filter: "판매"
    },
    {
      name: "한지민",
      profileUrl: "https://randomuser.me/api/portraits/women/88.jpg",
      message: "구매 확정했습니다~",
      time: "2일 전",
      unread: 0,
      filter: "구매"
    },
    {
      name: "장동건",
      profileUrl: "https://randomuser.me/api/portraits/men/99.jpg",
      message: "시간 조정 가능할까요?",
      time: "10분 전",
      unread: 4,
      filter: "판매"
    },
    {
      name: "배수지",
      profileUrl: "https://randomuser.me/api/portraits/women/90.jpg",
      message: "편하신 시간 알려주세요!",
      time: "방금",
      unread: 1,
      filter: "구매"
    },
  ];
  
  const parseTime = (time: string): number => {
    if (time.includes("방금")) return 0;
    if (time.includes("분 전")) return parseInt(time) || 0;
    if (time.includes("시간 전")) return (parseInt(time) || 0) * 60;
    if (time.includes("어제")) return 1440;
    if (time.includes("일 전")) return (parseInt(time) || 0) * 1440;
    return 999999999;
  };

  // const filteredChatRooms = chatRooms.filter((chat) => filter === '전체' ? true : chat.filter === filter);

  const filteredChatRooms = chatRooms
  .filter((chat) => (filter === "전체" ? true : chat.filter === filter))
  .sort((a, b) => {
    if ((b.unread > 0 ? 1 : 0) !== (a.unread > 0 ? 1 : 0)) {
      return b.unread - a.unread;
    }

    const timeA = parseTime(a.time);
    const timeB = parseTime(b.time);

    return timeA - timeB;
  });

  // unread > 0 우선, 다음 순위는 시간 빠른 순 정렬


  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex space-x-2">
        {filters.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1 rounded-full font-semibold text-sm ${
              filter === type
                ? "bg-[#832A2A] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Chatting List */}
      <ul className="divide-y divide-gray-200">
        {filteredChatRooms.map((chat, idx) => (
          <li key={idx} className="flex items-center py-4 gap-4">
            <img src={chat.profileUrl} alt="example" className="w-12 h-12 rounded-full" />

            <div className="flex-1">
              {/* name time */}
              <div className="flex justify-between items-center">
                <span className="font-bold">{chat.name}</span>
                <span className="text-sm text-gray-400">{chat.time}</span>
              </div>

              {/* message unread */}
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-500 truncate">{chat.message}</span>

                <span
                  className={`text-xs text-white rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center ${
                    chat.unread > 0 ? "bg-orange-500 visible" : "invisible"
                  }`}
                >
                  {chat.unread}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatListPage;