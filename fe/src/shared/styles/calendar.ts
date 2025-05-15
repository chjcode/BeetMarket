import Calendar from "react-calendar";
import styled from "styled-components";
import "react-calendar/dist/Calendar.css";

export const StyledCalendarWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  position: relative;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  padding: 1rem;
  background-color: #fff;

  .react-calendar {
    width: 100%;
    border: none;
    border-radius: 0.5rem;
    padding: 16px;
    background-color: white;
    position: relative;
  }

  /* 날짜 타일 공통 */
  .react-calendar__tile {
    position: relative;
    background: none !important;
    border-radius: 0.5rem;
    outline: none !important;
    box-shadow: none !important;
    transition: none !important;
    color: inherit !important;
  }

  /* 오늘 */
  .react-calendar__tile--now {
    background: none !important;
    abbr {
      color: #6366f1 !important;
    }
  }

  /* 선택된 날짜 */
  .react-calendar__tile--active,
  .react-calendar__tile--active:focus,
  .react-calendar__tile--active:hover {
    background-color: #fef3c7 !important;
    border-radius: 0.5rem !important;
    outline: none !important;
    box-shadow: none !important;

    abbr {
      color: #f97316 !important;
      font-weight: bold !important;
    }
  }

  /* hover 제거 */
  .react-calendar__tile:enabled:hover {
    background: none !important;
    box-shadow: none !important;
  }

  .react-calendar__month-view__weekdays abbr {
    text-decoration: none;
    font-weight: bold;
  }

  /* 🔥 navigation 스타일 수정 */
  .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 0.5rem;
  }

  .react-calendar__navigation__arrow,
  .react-calendar__navigation__label {
    background: none !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    padding: 0.5rem;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
  }

  .react-calendar__navigation__arrow:enabled:hover,
  .react-calendar__navigation__label:enabled:hover {
    background: none !important;
  }

  /* 연/월 글자 크기 조정 */
  .react-calendar__navigation__label {
    flex-grow: 0;
  }
`;

export const StyledCalendar = styled(Calendar)``;

export const StyledToday = styled.div`
  font-size: 10px;
  color: #f97316;
  font-weight: 600;
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
`;

export const StyledDot = styled.div`
  background-color: #c084fc;
  border-radius: 50%;
  width: 5px;
  height: 5px;
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translateX(-50%);
`;

export const StyledDate = styled.div`
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  background-color: #f97316;
  color: white;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 9999px;
  cursor: pointer;
  z-index: 10;
`;
