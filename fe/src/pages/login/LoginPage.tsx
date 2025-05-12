import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  return (
    <div className="flex justify-center w-screen bg-gray-100 min-h-screen">
      <div
        className="
          w-full 
          min-w-[360px] 
          max-w-[480px] 
          flex flex-col 
          bg-[#F3D6F7]
          shadow-md 
          items-center "
      >
        {/* <img src="src/shared/assets/beet3.png" className="w-[120px] mb-4" />
        <h1 className="text-[#370035] text-4xl font-extrabold font-moneygraphy mb-[30%]">
          비트마켓
        </h1>
        <div className="w-[88%] h-[48px] bg-white/90 border border-2 border-[#C6C6C6] rounded-xl flex justify-center items-center">
          <FcGoogle className="w-7 h-7 " />
          <div className="mx-2 text-xl font-medium">Google 계정으로 로그인</div>
        </div> */}
      </div>
    </div>
  );
};

export default LoginPage;