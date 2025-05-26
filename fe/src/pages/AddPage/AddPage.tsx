import React, { useRef, useState } from "react";
import InputTextField from "@/shared/ui/TextForm/TextForm";
import Button from "@/shared/ui/Button/Button";
import axiosInstance from "@/shared/api/axiosInstance";
import PlacePickerModal from "@/widgets/PlacePicker/PlacePickerModal";
import { useNavigate } from "react-router-dom";
import Loading from "@/shared/ui/Loading/Loading";

const AddPage = () => {
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [place, setPlace] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [showMap, setShowMap] = useState(false);
  const [latlng, setLatlng] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5 - images.length);
      setImages((prev) => [...prev, ...files].slice(0, 5));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const uploadFiles = async (uuid: string) => {
    const files = [
      ...images.map((file) => ({
        fileName: file.name,
        fileType: file.type,
        filesize: file.size,
      })),
      ...(video
        ? [
            {
              fileName: video.name,
              fileType: video.type,
              filesize: video.size,
            },
          ]
        : []),
    ];

    const res = await axiosInstance.post("/api/uploads/pre-signed-url", {
      uuid,
      files,
    });

    const presignedFiles = res.data.content.files;
    const publicUrls: string[] = [];

    for (let i = 0; i < presignedFiles.length; i++) {
      const { presignedUrl, publicUrl } = presignedFiles[i];
      const file = i < images.length ? images[i] : video!;
      await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      publicUrls.push(publicUrl);
    }

    return {
      imageUrls: publicUrls.slice(0, images.length),
      videoUrl:
        publicUrls.length > images.length ? publicUrls[images.length] : null,
    };
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (loading) return;

    if (!price || isNaN(Number(price))) {
      alert("가격을 숫자로 입력해주세요.");
      return;
    }
    if (Number(price) < 0 || Number(price) > 99999999) {
      alert("가격은 0원 이상 99,999,999원 이하로 입력해주세요.");
      return;
    }

    if (!title) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (title.length > 30) {
      alert("제목은 최대 30자까지 입력 가능합니다.");
      return;
    }

    if (!content) {
      alert("내용을 입력해주세요.");
      return;
    }
    if (content.length > 200) {
      alert("내용은 최대 200자까지 입력 가능합니다.");
      return;
    }

    if (!category) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    if (images.length === 0) {
      alert("상품 이미지를 최소 1장 이상 등록해주세요.");
      return;
    }

    setLoading(true);

    try {
      const uuid = crypto.randomUUID();
      const { imageUrls, videoUrl } = await uploadFiles(uuid);

      const payload = {
        title,
        content,
        category,
        price: Number(price),
        region: place,
        location: place,
        images: imageUrls,
        video: videoUrl,
        uuid,
        latitude: latlng?.lat ?? 37.36,
        longitude: latlng?.lng ?? 126.98,
      };

      console.log("📦 서버에 보낼 payload:", payload);
      const res = await axiosInstance.post("/api/posts", payload);
      const postId = res.data.content?.id;
      if (postId) {
        navigate(`/product/${postId}`);
      } else {
        alert("등록 실패: 게시글 ID 없음");
      }
    } catch (error) {
      console.error(error);
      alert("등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form
        className="relative max-w-md mx-auto px-4 pt-6 pb-18 flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <InputTextField
          label="가격"
          placeholder="₩ 가격을 입력해주세요."
          value={price ? `₩ ${parseInt(price, 10).toLocaleString()}` : ""}
          onChange={(e) => {
            const val = e.target.value.replace(/[^0-9]/g, "");
            if (val.length > 8) return;
            setPrice(val);
          }}
        />
        <InputTextField
          label="제목"
          placeholder="제목"
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= 30) {
              setTitle(e.target.value)
            }
          }}
        />
        <div>
          <label className="text-lg font-bold mb-2">글 내용</label>
          <textarea
            placeholder="내용을 입력해주세요"
            className="border-2 border-[#CBCBCB] focus:outline-none focus:border-2 rounded-xl px-4 py-3 placeholder-[#8B8B8B] text-[#000000] w-full min-h-[150px] resize-none"
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= 200) {
                setContent(e.target.value)
              }
            }}
          />
        </div>
        <div>
          <label className="text-lg font-bold mb-2">카테고리</label>
          <select
            className="border-2 border-[#CBCBCB] focus:outline-none focus:border-2 rounded-xl px-4 py-3 text-[#000000] w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">대분류 선택</option>
            <option value="전자기기">전자기기</option>
            <option value="가구/인테리어">가구/인테리어</option>
            <option value="유아동">유아동</option>
            <option value="의류/잡화">의류/잡화</option>
            <option value="생활용품">생활용품</option>
            <option value="스포츠/레저">스포츠/레저</option>
            <option value="취미/게임/음반">취미/게임/음반</option>
            <option value="반려동물">반려동물</option>
            <option value="뷰티/미용">뷰티/미용</option>
            <option value="도서">도서</option>
            <option value="티켓/교환권">티켓/교환권</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div>
          <label className="text-lg font-bold mb-2 flex items-center gap-2">
            사진 등록{" "}
            <span className="text-base font-normal text-gray-400">
              ({images.length}/5)
            </span>
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center border-2 border-[#CBCBCB] relative overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(img)}
                  alt={`preview-${idx}`}
                  className="w-full h-full object-cover rounded-xl"
                />
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
        <div>
          <label className="text-lg font-bold mb-2 flex items-center gap-2">
            영상 등록{" "}
            <span className="text-base font-normal text-gray-400">
              {video ? "(1/1)" : "(0/1)"}
            </span>
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {video && (
              <div className="w-32 h-20 rounded-xl bg-gray-200 flex items-center justify-center border-2 border-[#CBCBCB] relative overflow-hidden">
                <video
                  src={URL.createObjectURL(video)}
                  controls
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() => setVideo(null)}
                >
                  ×
                </button>
              </div>
            )}
            {!video && (
              <div
                className="w-32 h-20 rounded-xl bg-gray-200 flex items-center justify-center cursor-pointer border-2 border-[#CBCBCB]"
                onClick={() => videoInputRef.current?.click()}
              >
                <span className="text-3xl text-gray-400">+</span>
                <input
                  type="file"
                  accept="video/*"
                  ref={videoInputRef}
                  className="hidden"
                  onChange={handleVideoChange}
                />
              </div>
            )}
          </div>
        </div>

        <InputTextField
          label="거래 장소 선택"
          placeholder="장소 선택"
          value={place}
          readOnly // 텍스트로 입력 불가
          onClick={() => setShowMap(true)}
        />

        {showMap && (
          <PlacePickerModal
            onClose={() => setShowMap(false)}
            onSelect={({ lat, lng, address }) => {
              console.log("선택된 위치:", lat, lng, address);
              setPlace(address);
              setLatlng({ lat, lng });
            }}
            initialLatLng={latlng ?? undefined}
          />
        )}

        <Button
          label="등록하기"
          width="100%"
          // onClick={() => handleSubmit()}
          // type="submit"
          disabled={loading}
        />
      </form>
      {loading && <Loading />}
    </>
  );
  
};

export default AddPage;
