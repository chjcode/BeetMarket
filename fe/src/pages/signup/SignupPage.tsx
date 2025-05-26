import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button/Button";
import axiosInstance from "@/shared/api/axiosInstance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const cityDistrictMap: Record<string, string[]> = {
  "서울특별시": [
    "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
    "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
    "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
  ],
  "부산광역시": [
    "강서구", "금정구", "기장군", "남구", "동구", "동래구", "부산진구", "북구",
    "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구"
  ],
  "대구광역시": [
    "군위군", "남구", "달서구", "달성군", "동구", "북구", "서구", "수성구", "중구"
  ],
  "인천광역시": [
    "강화군", "계양구", "남동구", "동구", "미추홀구", "부평구", "서구",
    "연수구", "옹진군", "중구"
  ],
  "광주광역시": ["광산구", "남구", "동구", "북구", "서구"],
  "대전광역시": ["대덕구", "동구", "서구", "유성구", "중구"],
  "울산광역시": ["남구", "동구", "북구", "울주군", "중구"],
  "세종특별자치시": ["세종시"],
  "경기도": [
    "가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시",
    "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시",
    "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시",
    "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"
  ],
  "강원특별자치도": [
    "강릉시", "고성군", "동해시", "삼척시", "속초시", "양구군", "양양군", "영월군",
    "원주시", "인제군", "정선군", "철원군", "춘천시", "태백시", "평창군", "홍천군",
    "화천군", "횡성군"
  ],
  "충청북도": [
    "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "제천시",
    "증평군", "진천군", "청주시", "충주시"
  ],
  "충청남도": [
    "계룡시", "공주시", "금산군", "논산시", "당진시", "보령시", "부여군",
    "서산시", "서천군", "아산시", "예산군", "천안시", "청양군", "태안군", "홍성군"
  ],
  "전북특별자치도": [
    "고창군", "군산시", "김제시", "남원시", "무주군", "부안군", "순창군",
    "완주군", "익산시", "임실군", "장수군", "전주시", "정읍시", "진안군"
  ],
  "전라남도": [
    "강진군", "고흥군", "곡성군", "광양시", "구례군", "나주시", "담양군", "목포시",
    "무안군", "보성군", "순천시", "신안군", "여수시", "영광군", "영암군", "완도군",
    "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"
  ],
  "경상북도": [
    "경산시", "경주시", "고령군", "구미시", "김천시", "문경시", "봉화군",
    "상주시", "성주군", "안동시", "영덕군", "영양군", "영주시", "영천시",
    "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군", "포항시"
  ],
  "경상남도": [
    "거제시", "거창군", "고성군", "김해시", "남해군", "밀양시", "사천시",
    "산청군", "양산시", "의령군", "진주시", "창녕군", "창원시", "통영시",
    "하동군", "함안군", "함양군", "합천군"
  ],
  "제주특별자치도": ["서귀포시", "제주시"]
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [nickName, setNickName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const [nickNameError, setNickNameError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [regionError, setRegionError] = useState("");

  const isValidDate = (dateStr: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const date = new Date(dateStr);
    const iso = date.toISOString().split("T")[0];
    return regex.test(dateStr) && !isNaN(date.getTime()) && iso === dateStr;
  };

  const formatBirthDate = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");
    if (numbersOnly.length <= 4) {
      return numbersOnly;
    } else if (numbersOnly.length <= 6) {
      return `${numbersOnly.slice(0, 4)}-${numbersOnly.slice(4)}`;
    } else {
      return `${numbersOnly.slice(0, 4)}-${numbersOnly.slice(4, 6)}-${numbersOnly.slice(6, 8)}`;
    }
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
    } else if (!isValidDate(birthDate)) {
      setBirthDateError("올바른 생년월일 형식(YYYY-MM-DD)이 아닙니다.");
      isValid = false;
    }

    if (!gender) {
      setGenderError("성별을 선택해주세요.");
      isValid = false;
    }

    if (!city || !district) {
      setRegionError("지역을 선택해주세요.");
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await axiosInstance.post("/api/users/signup", {
        nickname: nickName,
        birthDate,
        gender,
        region: `${city} ${district}`,
      });
      console.log("회원가입 성공:", response.data);
      navigate("/");
    } catch (err) {
      console.error("회원가입 실패:", err);
      alert("회원가입에 실패했습니다. \n닉네임이 중복이거나, 생년월일 입력 방식이 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex justify-center w-screen bg-gray-100 min-h-screen">
      <div className="w-full min-w-[360px] max-w-[480px] flex flex-col shadow-md bg-white p-4">
        <h2 className="text-2xl font-bold mb-4">회원 정보 입력</h2>

        <Input
          label="닉네임"
          placeholder="닉네임을 입력하세요"
          value={nickName}
          onChange={(e) => {
            setNickName(e.target.value);
            setNickNameError("");
          }}
          error={nickNameError}
          width="90%"
        />

        <Input
          label="생년월일"
          placeholder="YYYY-MM-DD"
          value={birthDate}
          onChange={(e) => {
            const formatted = formatBirthDate(e.target.value);
            setBirthDate(formatted);
            setBirthDateError("");
          }}
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
                  gender === option.value ? "font-semibold border-black" : "border-gray-300 text-gray-600"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={gender === option.value}
                  onChange={(e) => {
                    setGender(e.target.value as "MALE" | "FEMALE");
                    setGenderError("");
                  }}
                  className="hidden"
                />
                {option.label}
              </label>
            ))}
          </div>
          {genderError && <p className="pl-2 text-sm text-red-500 mt-1">{genderError}</p>}
        </div>

        <div className="w-[90%] flex flex-col gap-4">
          <Select
            label="시/도"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setDistrict("");
              setRegionError("");
            }}
            options={Object.keys(cityDistrictMap).map((cityName) => ({
              label: cityName,
              value: cityName,
            }))}
          />

          <Select
            label="시/군/구"
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setRegionError("");
            }}
            options={
              city
                ? cityDistrictMap[city].map((d) => ({ label: d, value: d }))
                : []
            }
            disabled={!city}
          />
          {regionError && <p className="text-sm text-red-500">{regionError}</p>}
        </div>

        <div className="mt-6">
          <Button label="서비스 시작하기" width="90%" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;