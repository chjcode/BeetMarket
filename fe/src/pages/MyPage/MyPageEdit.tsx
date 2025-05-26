import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputTextField from "@/shared/ui/TextForm/TextForm";
import Button from "@/shared/ui/Button/Button";
import { FiSettings } from "react-icons/fi";
import axiosInstance from "@/shared/api/axiosInstance";

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

const cities = Object.keys(cityDistrictMap);

const MyPageEdit = () => {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({ nickname: "", region: "", profileImage: "" });
  const [nickname, setNickname] = useState("");
  const [city, setCity] = useState("서울특별시");
  const [district, setDistrict] = useState("강남구");
  const [imageUrl, setImageUrl] = useState("/beet.png");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/users/my");
        const content = res.data.content;
        setInitialData({
          nickname: content.nickname,
          region: content.region,
          profileImage: content.profileImage || "/beet.png",
        });
        setImageUrl(content.profileImage || "/beet.png");

        const [initCity, initDistrict] = content.region.split(" ");
        setCity(initCity);
        setDistrict(initDistrict);
      } catch (e) {
        console.error("유저 정보 불러오기 실패", e);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (city && cityDistrictMap[city]) {
      // 이미 선택된 district가 해당 city에 없다면 초기값으로
      if (!cityDistrictMap[city].includes(district)) {
        setDistrict(cityDistrictMap[city][0]);
      }
    }
  }, [city]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    const uuid = crypto.randomUUID();

    const res = await axiosInstance.post("/api/uploads/pre-signed-url", {
      uuid,
      files: [
        {
          fileName: file.name,
          fileType: file.type,
          filesize: file.size,
        },
      ],
    });

    const { presignedUrl, publicUrl } = res.data.content.files[0];

    await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    return publicUrl;
  };

  const handleSubmit = async () => {
    const region = `${city} ${district}`;
    const finalNickname = nickname.trim() || initialData.nickname;
    let finalImageUrl = initialData.profileImage;

    setIsSubmitting(true);

    try {
      if (imageFile) {
        finalImageUrl = await uploadProfileImage(imageFile);
      }

      const payload = {
        nickname: finalNickname,
        region,
        profileImage: finalImageUrl,
      };

      await axiosInstance.patch("/api/users/my", payload);

      alert("✅ 정보가 성공적으로 수정되었습니다.");
      navigate("/mypage");
    } catch (e) {
      console.error("❌ 수정 실패", e);
      alert("❌ 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="max-w-xs mx-auto flex flex-col items-center pt-6 pb-16 px-0 gap-4">
      <div className="relative mb-2">
        <img
          src={imageUrl}
          alt="프로필"
          className="w-32 h-32 rounded-full object-cover"
        />
        <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer">
          <FiSettings className="text-2xl text-black" />
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </div>

      <div className="w-full">
        <InputTextField
          label="닉네임"
          placeholder={initialData.nickname}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <div className="w-full flex gap-2">
        <div className="flex-1">
          <label className="text-lg font-bold mb-2 block">시/도</label>
          <select
            className="border-2 border-[#CBCBCB] rounded-xl px-4 py-3 w-full"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setDistrict(cityDistrictMap[e.target.value][0]);
            }}
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-lg font-bold mb-2 block invisible">시/군/구</label>
          <select
            className="border-2 border-[#CBCBCB] rounded-xl px-4 py-3 w-full"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            {(cityDistrictMap[city] || []).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full mt-6">
        <Button
          label={isSubmitting ? "수정 중..." : "수정하기"}
          width="100%"
          onClick={handleSubmit}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};

export default MyPageEdit;
