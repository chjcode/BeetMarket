import { useNavigate } from "react-router-dom";
import beetsad from "@/shared/assets/beetsad.png";
import Button from "@/shared/ui/Button/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 max-w-[480px] mx-auto px-4 flex flex-col items-center justify-center bg-[#F3D6F7]">
      <img
        src={beetsad}
        alt="슬픈 비트"
        className="w-[180px] h-[180px] mb-8"
      />
      <div className="text-[#6B4A7C] text-xl mb-10">
        페이지를 찾을 수 없습니다.
      </div>
      <Button
        label="이전 페이지로 돌아가기"
        onClick={() => navigate(-1)}
      />
    </div>
  );
};

export default NotFoundPage;
