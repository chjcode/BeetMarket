import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "../model/useGoogleLogin";

export const GoogleLoginButton = () => {
  const handleLogin = useGoogleLogin();
  return (
    <button
      onClick={() => handleLogin()}
      className="w-[88%] h-[48px] bg-white/90 border-2 border-[#C6C6C6] rounded-xl flex justify-center items-center cursor-pointer"
    >
      <FcGoogle className="w-7 h-7" />
      <div className="mx-2 text-xl font-medium">Google 계정으로 로그인</div>
    </button>
  );
};
