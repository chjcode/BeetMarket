import { FcGoogle } from "react-icons/fc";

export const LoginPage = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 max-w-[480px] mx-auto flex flex-col items-center bg-[#F3D6F7] pt-48 mx-4">
      <img src="src/shared/assets/beet.png" className="w-36 mb-4" />
      <h1 className="text-[#370035] text-4xl font-extrabold mb-16">비트마켓</h1>
      <div className="w-[94%] h-[48px] bg-white/90 border border-2 border-[#C6C6C6] rounded-md flex justify-center items-center">
        <FcGoogle className="w-7 h-7 " />
        <div className="mx-2 text-xl font-medium">Google 계정으로 로그인</div>
      </div>
    </div>
  );
};
