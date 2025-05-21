import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputTextField from "@/shared/ui/TextForm/TextForm";
import Button from "@/shared/ui/Button/Button";
import { FiSettings } from "react-icons/fi";
import axiosInstance from "@/shared/api/axiosInstance";

const cityDistrictMap: Record<string, string[]> = {
  "서울특별시": ["종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"],
  "부산광역시": ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"],
  "대구광역시": ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"],
  "인천광역시": ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
  "광주광역시": ["동구", "서구", "남구", "북구", "광산구"],
  "대전광역시": ["동구", "중구", "서구", "유성구", "대덕구"],
  "울산광역시": ["중구", "남구", "동구", "북구", "울주군"],
  "세종특별자치시": ["세종시"],
  "경기도": ["수원시", "성남시", "고양시", "용인시", "부천시", "안산시", "안양시", "남양주시", "화성시", "평택시", "의정부시", "시흥시", "파주시", "광명시", "김포시", "군포시", "광주시", "이천시", "양주시", "오산시", "구리시", "안성시", "포천시", "의왕시", "하남시", "여주시", "동두천시", "과천시", "가평군", "양평군", "연천군"],
  "강원특별자치도": ["춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"],
  "충청북도": ["청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"],
  "충청남도": ["천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"],
  "전북특별자치도": ["전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"],
  "전라남도": ["목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"],
  "경상북도": ["포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"],
  "경상남도": ["창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"],
  "제주특별자치도": ["제주시", "서귀포시"]
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
