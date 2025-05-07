import { useState } from "react";

const ChattingListPage = () => {
  const [filter, setFilter] = useState<"전체" | "구매" | "판매">("전체");

  const filters = ["전체", "구매", "판매"] as const;

  // const chatRooms = Array(10).fill({
  //   name: "이종문",
  //   message: "맛있게 드세요",
  //   time: "12시간 전",
  //   unread: 1,
  // });

    return (
      <div className="space-y-4">
      {/* 필터 버튼 */}
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
      </div>
    );
  };
  
  export default ChattingListPage;
  