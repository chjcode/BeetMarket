import React, { useState } from "react";
import InputTextField from "@/shared/ui/TextForm/TextForm";
import Button from "@/shared/ui/Button/Button";
import { FiSettings } from "react-icons/fi";

const years = Array.from({ length: 100 }, (_, i) => `${2024 - i}`);
const cities = ["서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"];
const districts = ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"];

const MyPageEdit = () => {
  const [nickname, setNickname] = useState("");
  const [year, setYear] = useState("1998");
  const [gender, setGender] = useState("남성");
  const [city, setCity] = useState("서울특별시");
  const [district, setDistrict] = useState("강남구");

  return (
    <form className="max-w-xs mx-auto flex flex-col items-center pt-6 pb-16 px-0 gap-4">
      {/* 프로필 이미지 */}
      <div className="relative mb-2">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400" />
        <button type="button" className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow">
          <FiSettings className="text-2xl text-black" />
        </button>
      </div>
      <div className="w-full">
        <InputTextField
          label="닉네임"
          placeholder="안녕하세요"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />
      </div>
      <div className="w-full">
        <label className="text-lg font-bold mb-2 block">출생년도</label>
        <select
          className="border-2 border-[#CBCBCB] rounded-xl px-4 py-3 w-full text-[#000]"
          value={year}
          onChange={e => setYear(e.target.value)}
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <div className="w-full">
        <label className="text-lg font-bold mb-2 block">성별</label>
        <select
          className="border-2 border-[#CBCBCB] rounded-xl px-4 py-3 w-full text-[#000]"
          value={gender}
          onChange={e => setGender(e.target.value)}
        >
          <option value="남성">남성</option>
          <option value="여성">여성</option>
        </select>
      </div>
      <div className="w-full flex gap-2">
        <div className="flex-1">
          <label className="text-lg font-bold mb-2 block">지역</label>
          <select
            className="border-2 border-[#CBCBCB] rounded-xl px-4 py-3 w-full text-[#000]"
            value={city}
            onChange={e => setCity(e.target.value)}
          >
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-lg font-bold mb-2 block invisible">구</label>
          <select
            className="border-2 border-[#CBCBCB] rounded-xl px-4 py-3 w-full text-[#000]"
            value={district}
            onChange={e => setDistrict(e.target.value)}
          >
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full mt-6">
        <Button label="수정하기" width="100%" />
      </div>
    </form>
  );
};

export default MyPageEdit;
