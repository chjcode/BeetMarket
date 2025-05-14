import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin2 } from "../model/useGoogleLogin2";

export const GoogleLoginButton2 = () => {
	const handleLogin = useGoogleLogin2();
	return (
    <button
      onClick={() => handleLogin()}
      className="w-[88%] h-[48px] bg-white/90 border-2 border-[#C6C6C6] rounded-xl flex justify-center items-center cursor-pointer"
    >
      <FcGoogle className="w-7 h-7" />
      <div className="mx-2 text-xl font-medium">
        href oauth2/authorization/google
      </div>
    </button>
  );
};
