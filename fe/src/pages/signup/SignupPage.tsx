import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import { useState } from "react";
import Button from "@/shared/ui/Button/Button";
import axiosInstance from "@/shared/api/axiosInstance";
import { useNavigate } from "react-router-dom";

const categoryOptions = [
  { label: "서울", value: "서울" },
  { label: "경기", value: "경기" },
  { label: "강원", value: "강원" },
  { label: "제주", value: "제주" },
];

const SignupPage = () => {
  const navigate = useNavigate();
  const [nickName, setNickName] = useState<string>();
  const [birthDate, setBirthDate] = useState<string>();
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">();
  const [category, setCategory] = useState<string>();
  const [nickNameError, setNickNameError] = useState<string>();
  const [birthDateError, setBirthDateError] = useState<string>();
  const [categoryError, setCategoryError] = useState<string>();
  const [genderError, setGenderError] = useState<string>();

  const handleNickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickName(value);
    if (value) {
      setNickNameError("");
    } else {
      setNickNameError("닉네임을 입력해주세요.");
    }
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBirthDate(value);
    if (value) {
      setBirthDateError("");
    } else {
      setBirthDateError("생년월일을 입력해주세요.");
    }
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGender(e.target.value as "MALE" | "FEMALE");
    setGenderError("");
  };

  const handleSubmit = async () => {
    let isValid = true;

    if (!nickName) {
      setNickNameError("닉네임을 입력해주세요.");
      isValid = false;
    }
    if (!birthDate) {
      setBirthDateError("생년월일을 입력해주세요.");
      isValid = false;
    }
    if (!gender) {
      setGenderError("성별을 선택해주세요.");
      isValid = false;
    }
    if (!category) {
      setCategoryError("지역을 선택해주세요.");
      isValid = false;
    }

    if (!isValid) return;

    const requestBody = {
      nickname: nickName,
      birthDate,
      gender,
      region: category,
    };

    console.log("회원가입 요청 데이터:", requestBody);

    try {
      const response = await axiosInstance.post(
        "/api/users/signup",
        requestBody
      );
      navigate("/");
      console.log("회원가입 성공:", response.data);
    } catch (err) {
      console.error("회원가입 실패:", err);
    }
  };

  return (
    <div className="flex justify-center w-screen bg-gray-100 min-h-screen">
      <div className="w-full min-w-[360px] max-w-[480px] flex flex-col shadow-md bg-white p-4">
        <h2 className="text-2xl font-bold mb-4">회원 정보 입력</h2>

        <Input
          label="닉네임"
          type="text"
          placeholder="닉네임을 입력하세요"
          value={nickName}
          onChange={handleNickNameChange}
          error={nickNameError}
          width="90%"
        />

        <Input
          label="생년월일"
          type="text"
          value={birthDate}
          placeholder="YYYY-MM-DD"
          onChange={handleBirthDateChange}
          error={birthDateError}
          width="90%"
        />

        <div className="w-[90%] mb-4">
          <label className="block font-semibold text-md pb-0.5">성별</label>
          <div className="flex gap-4">
            {[
              { label: "남", value: "MALE" },
              { label: "여", value: "FEMALE" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center justify-center gap-2 w-[100px] h-[48px] text-sm rounded-xl border-2 cursor-pointer ${
                  gender === option.value
                    ? "font-semibold"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={gender === option.value}
                  onChange={handleGenderChange}
                  className="hidden"
                />
                {option.label}
              </label>
            ))}
          </div>
          {genderError && (
            <p className="pl-2 text-sm text-red-500 mt-1">{genderError}</p>
          )}
        </div>

        <Select
          label="지역"
          width="90%"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCategoryError("");
          }}
          options={categoryOptions}
          error={categoryError}
        />

        <div className="mt-6">
          <Button label="서비스 시작하기" width="90%" onClick={handleSubmit}/>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;
