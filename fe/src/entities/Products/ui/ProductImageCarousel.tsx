import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";

interface ProductImageCarouselProps {
  imageUrls: string[];
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ imageUrls }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    mode: "snap",
    rubberband: false,
  });

  return (
    <div className="relative w-full aspect-square mb-4 overflow-hidden">
      {/* 슬라이더 영역 */}
      <div
        ref={sliderRef}
        className="keen-slider w-full h-full"
      >
        {imageUrls.map((url, idx) => (
          <div
            key={idx}
            className="keen-slider__slide flex justify-center items-center bg-gray-100"
          >
            <img
              src={url}
              alt={`상품 이미지 ${idx}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* 인디케이터 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
        {imageUrls.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              currentSlide === idx ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarousel;
