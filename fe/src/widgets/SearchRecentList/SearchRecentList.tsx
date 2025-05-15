import { PiClockCountdownFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { useSearchHistoryStore } from "@/shared/store/useSearchHistoryStore";
import { useNavigate } from "react-router-dom";

export const SearchRecentList = () => {
  const { keywords, removeKeyword, clearAll } = useSearchHistoryStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[12px] font-bold text-black">최근 검색</span>
        <button onClick={clearAll} className="text-[12px] font-semibold text-gray-400">
          전체 삭제
        </button>
      </div>

      {keywords.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {keywords.map((keyword, index) => (
            <li key={index} className="flex justify-between items-center text-sm">
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => navigate(`/search/result?query=${encodeURIComponent(keyword)}`)}
              >
                <PiClockCountdownFill className="text-gray-400 text-lg" />
                <span>{keyword}</span>
              </div>
              <button onClick={() => removeKeyword(keyword)}>
                <IoClose className="text-gray-400 text-base" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400">검색 기록이 없습니다.</p>
      )}
    </div>
  );
};
