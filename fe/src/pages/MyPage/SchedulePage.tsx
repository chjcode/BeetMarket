import { useState } from "react";
import { format } from "date-fns";
import {
  StyledCalendarWrapper,
  StyledCalendar,
  StyledToday,
  StyledDot,
  StyledDate,
} from "@/shared/styles/calendar";
import CalendarScheduleCard from "@/entities/Schedule/ui/CalendarScheduleCard";
import type { JSX } from 'react';

const SchedulePage = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());

  const schedules = [
    {
      id: 1,
      date: "2025-05-25",
      time: "18:00",
      place: "멀티캠퍼스",
      title: "강아지 인형 팝니다",
      opposite: "조현석",
      type: "BUY",
      imageUrl: "data:image/jpeg;base64,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",
    },
    {
      id: 2,
      date: "2025-05-21",
      time: "20:00",
      place: "서울시 강남구 역삼역 1번 출구",
      title: "고양이 인형 팝니다",
      opposite: "이종문",
      type: "SELL",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6t15wClIRtfMRhO0oPBOT32ubGoeap2b6jg&s",
    },
    {
      id: 3,
      date: "2025-05-21",
      time: "20:00",
      place: "역삼역 앞",
      title: "고양이 인형 팝니다",
      opposite: "이종문",
      type: "BUY",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6t15wClIRtfMRhO0oPBOT32ubGoeap2b6jg&s",
    },
  ];

  const eventDates = schedules.map((s) => s.date);
  const formattedSelected = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const filteredSchedules = schedules.filter(
    (s) => formattedSelected && s.date === formattedSelected
  );

  const handleTodayClick = () => {
    setActiveStartDate(today);
    setSelectedDate(today);
  };

  return (
    <>
      <StyledCalendarWrapper>
        <StyledCalendar
          value={selectedDate ?? today}
          onChange={(date) => setSelectedDate(date as Date)}
          activeStartDate={activeStartDate}
          onActiveStartDateChange={({ activeStartDate }) =>
            setActiveStartDate(activeStartDate!)
          }
          formatDay={( _ , date) => format(date, "d")}
          formatYear={( _ , date) => format(date, "yyyy")}
          formatMonthYear={( _ , date) => format(date, "yyyy. MM")}
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
              const color = "#A349A4";
              dots.push(<StyledDot key="dot" style={{ backgroundColor: color }} />);
            }

            return <>{dots}</>;
          }}
        />
        <StyledDate onClick={handleTodayClick}>오늘</StyledDate>
      </StyledCalendarWrapper>

      <div className="mt-4 w-full max-w-[480px] mx-auto">

        {/* 일정 제목 + 범례 같이 한 줄 */}
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

        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((s) => (
            <CalendarScheduleCard key={s.id} {...s} type={s.type as "BUY" | "SELL"} />
          ))
        ) : (
          <p className="text-sm px-4 text-gray-400">일정이 없습니다.</p>
        )}
      </div>

    </>
  );
};

export default SchedulePage;