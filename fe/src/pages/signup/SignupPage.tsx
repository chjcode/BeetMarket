import Input from "@/shared/ui/Input"
import Select from "@/shared/ui/Select";
import { useState } from "react";

const categoryOptions = [
  { label: "반려동물", value: "pet" },
  { label: "도서", value: "book" },
  { label: "기타", value: "etc" },
  { label: "티켓", value: "ticket" },
];
// 지역 데이터 (shared/constants/region.ts)
export const regions = {
  "서울특별시": ["강남구", "서초구", "송파구", "마포구"],
  "부산광역시": ["해운대구", "수영구", "부산진구"],
  "경기도": ["수원시", "성남시", "용인시"],
};


const SignupPage = () => {
	const [nickName, setNickName] = useState();
	const [birthDate, setBirthDate] = useState();
	const [success, setSuccess] = useState();
	const [error, setError] = useState();
	const [category, setCategory] = useState("");

	const handleNickNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setNickName(value);
		if (value){
			setSuccess("사용 가능한 닉네임입니다.")
			setError("");
		}
		else{
			setSuccess("");	
			setError( "사용불가능한 닉네임 입니다.")
		}
	};

	const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setBirthDate(value);
	}

	return (
		<div className="flex flex-col w-full h-full">
			<h2 className="text-2xl font-bold">회원 정보 입력</h2>
		{/* 
			닉네임 : text
			출생년도 calendar 뜨고  YYYY-MM-DD
			성별 : 남/녀
			지역 : 드롭다운 2개 나란히 경기도 성남시 or 서울특별시 강남구
		*/}
		<Input
			label="닉네임"
			type="text"
			placeholder="닉네임을 입력하세요"
			value={nickName}
			onChange={handleNickNameChange}
			success={success}
			error={error}
			width="90%"
		/>

		<Input
			label="생년월일"
			type="date"
			value={birthDate}
			placeholder="생년월일"
			onChange={handleBirthDateChange}
			width="90%"
		/>
		
		<Select
      label="생년월일"
			width="90%"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      options={categoryOptions}
      error={!category ? "카테고리를 선택해주세요" : ""}
    />

		</div>

	);
};

export default SignupPage;









// import { useState } from "react";
// import { regions } from "@/shared/constants/region";

// const RegionSelect = () => {
//   const [selectedProvince, setSelectedProvince] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");

//   const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedProvince(e.target.value);
//     setSelectedCity(""); // 초기화
//   };

//   const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedCity(e.target.value);
//   };

//   const provinces = Object.keys(regions);
//   const cities = selectedProvince ? regions[selectedProvince] : [];

//   return (
//     <div className="flex flex-col gap-4 w-full max-w-md">
//       {/* 시/도 선택 */}
//       <div>
//         <label className="block text-sm font-medium mb-1">시/도</label>
//         <select
//           value={selectedProvince}
//           onChange={handleProvinceChange}
//           className="w-full border px-3 py-2 rounded-md"
//         >
//           <option value="">선택하세요</option>
//           {provinces.map((province) => (
//             <option key={province} value={province}>
//               {province}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* 시/군/구 선택 */}
//       <div>
//         <label className="block text-sm font-medium mb-1">시/군/구</label>
//         <select
//           value={selectedCity}
//           onChange={handleCityChange}
//           disabled={!selectedProvince}
//           className="w-full border px-3 py-2 rounded-md"
//         >
//           <option value="">선택하세요</option>
//           {cities.map((city) => (
//             <option key={city} value={city}>
//               {city}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default RegionSelect;
