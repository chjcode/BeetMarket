interface CalendarScheduleCardProps {
  time: string;
  place: string;
  title: string;
  opposite: string;
  type: "BUY" | "SELL";
  imageUrl: string;
}

const CalendarScheduleCard = ({
  time,
  place,
  title,
  opposite,
  type,
  imageUrl,
}: CalendarScheduleCardProps) => {
  const isBuy = type === "BUY";

  return (
    <div className="flex items-center gap-3 border-t py-3 px-4">
      <div className="flex flex-col items-center text-sm w-[60px]">
        <span className={`font-bold ${isBuy ? "text-blue-500" : "text-red-500"}`}>
          {time}
        </span>
        <span className="text-[12px] text-gray-500 line-clamp-2 break-words mt-1">{place}</span>
      </div>
      <div className="w-[2px] h-[48px] bg-purple-400 rounded-full" />
      <div className="flex-1">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-[12px] text-gray-500">{opposite}</div>
      </div>
      <img
        src={imageUrl}
        alt={title}
        className="w-12 h-12 rounded-md object-cover shrink-0"
      />
    </div>
  );
};

export default CalendarScheduleCard;
