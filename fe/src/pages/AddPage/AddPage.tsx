import React, { useRef, useState } from "react";
import InputTextField from "@/shared/ui/TextForm/TextForm";
import Button from "@/shared/ui/Button/Button";

const inputClass = "border-2 border-[#CBCBCB] focus:outline-none focus:border-2 rounded-xl px-4 py-3 placeholder-[#8B8B8B] text-[#000000] w-full";
const labelClass = "text-lg font-bold mb-2";

const AddPage = () => {
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [place, setPlace] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5 - images.length);
      const readers = files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then(newImages => {
        setImages(prev => [...prev, ...newImages].slice(0, 5));
      });
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // 등록 처리
  };

  return (
    <form className="max-w-md mx-auto px-4 pt-6 pb-18 flex flex-col gap-6" onSubmit={handleSubmit}>
      <InputTextField
        label="가격"
        placeholder="₩ 가격을 입력해주세요."
        value={price ? `₩ ${parseInt(price, 10).toLocaleString()}` : ""}
        onChange={e => {
          // 숫자만 허용
          const val = e.target.value.replace(/[^0-9]/g, "");
          setPrice(val);
        }}
      />
      <InputTextField
        label="제목"
        placeholder="제목"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <div>
        <label className="text-lg font-bold mb-2">글 내용</label>
        <textarea
          placeholder="내용을 입력해주세요"
          className="border-2 border-[#CBCBCB] focus:outline-none focus:border-2 rounded-xl px-4 py-3 placeholder-[#8B8B8B] text-[#000000] w-full min-h-[150px] resize-none"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
      <div>
        <label className="text-lg font-bold mb-2">카테고리</label>
        <select
          className="border-2 border-[#CBCBCB] focus:outline-none focus:border-2 rounded-xl px-4 py-3 text-[#000000] w-full"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">대분류 선택</option>
          <option value="전자기기">전자기기</option>
          <option value="가구/인테리어">가구/인테리어</option>
          <option value="유아동">유아동</option>
          <option value="의류/잡화">의류/잡화</option>
          <option value="생활용품">생활용품</option>
          <option value="스포츠/레져">스포츠/레져</option>
          <option value="취미/게임/음반">취미/게임/음반</option>
          <option value="뷰티/미용">뷰티/미용</option>
          <option value="티켓/교환권">티켓/교환권</option>
          <option value="기타">기타</option>
        </select>
      </div>
      <div>
        <label className="text-lg font-bold mb-2 flex items-center gap-2">
          사진 등록 <span className="text-base font-normal text-gray-400">({images.length}/5)</span>
        </label>
        <div className="flex items-center gap-2 flex-wrap">
          {images.map((img, idx) => (
            <div key={idx} className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center border-2 border-[#CBCBCB] relative overflow-hidden">
              <img src={img} alt={`preview-${idx}`} className="w-full h-full object-cover rounded-xl" />
              <button
                type="button"
                className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
              >
                ×
              </button>
            </div>
          ))}
          {images.length < 5 && (
            <div
              className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center cursor-pointer border-2 border-[#CBCBCB]"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-3xl text-gray-400">+</span>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>
      </div>
      <InputTextField
        label="거래 장소 선택"
        placeholder="장소선택"
        value={place}
        onChange={e => setPlace(e.target.value)}
      />
      <Button
        label="등록 하기"
        width="100%"
        onClick={() => handleSubmit()}
      />
    </form>
  );
};

export default AddPage; 