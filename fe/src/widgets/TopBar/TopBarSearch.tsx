import { IoIosArrowBack } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useSearchUIStore } from "@/shared/store/useSearchUIStore";
import { useSearchHistoryStore } from "@/shared/store/useSearchHistoryStore";
import { useNavigate } from "react-router-dom";

export const TopBarSearch = () => {
  const { query, setQuery, placeholder } = useSearchUIStore();
  const { addKeyword } = useSearchHistoryStore();
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    addKeyword(trimmed);

    navigate("/", { replace: true }); // 현재 페이지를 홈으로 덮기
    setTimeout(() => {
      navigate(`/search/result?query=${encodeURIComponent(trimmed)}`); // 검색 결과 push
    }, 0);
  };

  return (
    <div className="flex items-center px-4 py-2 gap-2 border-b border-gray-200">
      <button onClick={() => navigate(-1)}>
        <IoIosArrowBack className="text-2xl" />
      </button>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder={placeholder}
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-700 placeholder:text-gray-400 outline-none"
      />
      <button onClick={handleSearch}>
        <IoSearch className="text-xl" />
      </button>
    </div>
  );
};
