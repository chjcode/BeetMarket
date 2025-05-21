import { useEffect, useState } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import {
  StyledCalendarWrapper,
  StyledCalendar,
  StyledToday,
  StyledDot,
  StyledDate,
} from "@/shared/styles/calendar";
import CalendarScheduleCard from "@/entities/Schedule/ui/CalendarScheduleCard";
import { fetchMySchedule } from "@/shared/api/scheduleApi";
import type { JSX } from "react";

interface ScheduleResponse {
  schedule: string;
  location: string;
  tradeType: "BUY" | "SELL";
  opposite: string;
  postThumbnail: string;
  postTitle: string;
}

const SchedulePage = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [activeStartDate, setActiveStartDate] = useState<Date>(today);

  const [schedules, setSchedules] = useState<ScheduleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const dummySchedules: ScheduleResponse[] = [
    {
      schedule: "2025-05-21T14:00:00",
      location: "서울 강남구 역삼1동 멀티캠퍼스 1층층",
      tradeType: "SELL",
      opposite: "홍길동",
      postThumbnail: "/beet.png",
      postTitle: "아이폰 13 미개봉",
    },
    {
      schedule: "2025-05-21T19:30:00",
      location: "서울 종로구 종로역 우리집",
      tradeType: "BUY",
      opposite: "김철수",
      postThumbnail: "/beet.png",
      postTitle: "게이밍 노트북",
    },
    {
      schedule: "2025-05-25T10:00:00",
      location: "서울 마포구",
      tradeType: "SELL",
      opposite: "이영희",
      postThumbnail: "/beet.png",
      postTitle: "의자 팝니다",
    },
  ];

  // API 호출
  useEffect(() => {
    const fetchData = async () => {
      const start = format(startOfMonth(activeStartDate), "yyyy-MM-dd'T'00:00");
      const end = format(endOfMonth(activeStartDate), "yyyy-MM-dd'T'23:59");
      setIsLoading(true);
      setIsError(false);

      try {
        // const data = await fetchMySchedule(start, end);
        const data = dummySchedules;
        setSchedules(data);
      } catch (error) {
        console.error("일정 조회 실패", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeStartDate]);

  const handleTodayClick = () => {
    setSelectedDate(today);
    setActiveStartDate(today);
  };

  const eventDates = schedules.map((s) => s.schedule.split("T")[0]);
  const formattedSelected = format(selectedDate, "yyyy-MM-dd");

  const filteredSchedules = schedules.filter(
    (s) => s.schedule.startsWith(formattedSelected)
  );

  return (
    <>
      <StyledCalendarWrapper>
        <StyledCalendar
          value={selectedDate}
          onChange={(date) => setSelectedDate(date as Date)}
          activeStartDate={activeStartDate}
          onActiveStartDateChange={({ activeStartDate }) =>
            setActiveStartDate(activeStartDate!)
          }
          formatDay={(_, date) => format(date, "d")}
          formatYear={(_, date) => format(date, "yyyy")}
          formatMonthYear={(_, date) => format(date, "yyyy. MM")}
          calendarType="gregory"
          showNeighboringMonth={false}
          next2Label={null}
          prev2Label={null}
          minDetail="year"
          tileContent={({ date, view }) => {
            const dots: JSX.Element[] = [];

            if (
              view === "month" &&
              format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
            ) {
              dots.push(<StyledToday key="today">오늘</StyledToday>);
            }

            const targetDate = format(date, "yyyy-MM-dd");
            if (view === "month" && eventDates.includes(targetDate)) {
              dots.push(
                <StyledDot key="dot" style={{ backgroundColor: "#A349A4" }} />
              );
            }

            return <>{dots}</>;
          }}
        />
        <StyledDate onClick={handleTodayClick}>오늘</StyledDate>
      </StyledCalendarWrapper>

      <div className="mt-4 w-full max-w-[480px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">
            {format(selectedDate, "yyyy년 M월 d일")} 일정
          </p>
          <div className="flex gap-3 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-600 text-xs">판매</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-gray-600 text-xs">구매</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm px-4 text-gray-400">일정을 불러오는 중...</p>
        ) : isError ? (
          <p className="text-sm px-4 text-red-500">일정 불러오기 실패</p>
        ) : filteredSchedules.length > 0 ? (
          filteredSchedules.map((s, i) => (
            <CalendarScheduleCard
              key={i}
              time={s.schedule.split("T")[1].slice(0, 5)}
              place={s.location}
              title={s.postTitle}
              opposite={s.opposite}
              type={s.tradeType}
              imageUrl={s.postThumbnail}
            />
          ))
        ) : (
          <p className="text-sm px-4 text-gray-400">일정이 없습니다.</p>
        )}
      </div>
    </>
  );
};

export default SchedulePage;
