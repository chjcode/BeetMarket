import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchHistoryStore } from "@/shared/store/useSearchHistoryStore";
import { useSearchUIStore } from "@/shared/store/useSearchUIStore";
import { SearchRecentList } from "@/widgets/SearchRecentList/SearchRecentList";

const SearchPage = () => {
  const { addKeyword } = useSearchHistoryStore();
  const { setOnSearch, setPlaceholder } = useSearchUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    setPlaceholder("검색어를 입력하세요.");

    setOnSearch((q: string) => {
      const query = q.trim();
      if (!query) return;

      addKeyword(query);

      navigate("/", { replace: true });

      setTimeout(() => {
        navigate(`/search/result?query=${encodeURIComponent(query)}`);
      }, 0);
    });
  }, [setOnSearch, setPlaceholder, addKeyword, navigate]);

  return (
    <div className="py-4">
      <SearchRecentList />
    </div>
  );
};  

export default SearchPage;