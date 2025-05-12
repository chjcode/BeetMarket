import Button from "@/shared/ui/Button/Button";
// import InputTextField  from "@/shared/ui/TextForm"

export const SignUpPage = () => {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold h-[52px] flex items-center">
        회원 정보 입력
      </h2>
      {/* <InputTextField/> */}
      <Button label="서비스 시작하기" />
    </div>
  );
};
