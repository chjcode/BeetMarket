const alarms = [
  {
    id: 1,
    message: "안녕하세요 님과 거래 일정이 있습니다.",
    detail: "12 : 30 | 역삼역 6번 출구",
  },
  {
    id: 2,
    message: "안녕하세요 님과 거래 일정이 있습니다.",
    detail: "12 : 30 | 역삼역 6번 출구",
  },
  {
    id: 3,
    message: "안녕하세요 님과 거래 일정이 있습니다.",
    detail: "12 : 30 | 역삼역 6번 출구",
  },
];

const AlarmPage = () => {
  return (
    <div className="bg-white min-h-screen px-4 pt-8 pb-4">
      <ul className="flex flex-col gap-y-10">
        {alarms.map((alarm) => (
          <li key={alarm.id} className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 mr-4" />
            <div>
              <div className="font-medium text-sm mb-1">{alarm.message}</div>
              <div className="text-xs text-gray-400">{alarm.detail}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlarmPage;
