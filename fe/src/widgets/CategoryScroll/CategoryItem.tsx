import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaRegClock } from "react-icons/fa6";

interface CategoryItemProps {
  label: string;
  imageName: string;
}

const iconMap = {
  "전체 보기": BsFillGrid3X3GapFill,
  "최근 본 상품": FaRegClock,
};

export const CategoryItem = ({ label, imageName }: CategoryItemProps) => {
  const Icon = iconMap[label as keyof typeof iconMap];

  return (
    // <div className="flex flex-col items-center w-full">
    <div className="flex flex-col items-center w-[60px]">
      {/* <div className="w-full aspect-square overflow-hidden flex items-center justify-center  rounded-full shadow-md bg-[#fcf9f2]"> */}
      <div className="w-[60px] h-[60px] flex items-center justify-center aspect-square overflow-hidden rounded-3xl shadow-md bg-[#fcf9f2]">
        {Icon ? (
          // <Icon className="w-[70%] h-[70%] m-auto object-contain" />
          <Icon className="w-[50%] h-[50%] m-auto object-contain" />
        ) : (
          <img
            src={`/categoryImage/${imageName}`}
            alt={label}
            className="w-[80%] object-fit"
            // className="w-full h-full object-contain"
            draggable={false}
          />
        )}
      </div>
      <span className="mt-1 text-[13px] leading-tight text-center whitespace-nowrap">
        {label}
      </span>
    </div>
  );
};