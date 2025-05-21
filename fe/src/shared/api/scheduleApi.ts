import axiosInstance from "./axiosInstance";

interface ScheduleResponse {
  schedule: string;
  location: string;
  tradeType: "BUY" | "SELL";
  opposite: string;
  postThumbnail: string;
  postTitle: string;
}

export const fetchMySchedule = async (
  start?: string,
  end?: string
): Promise<ScheduleResponse[]> => {
  const res = await axiosInstance.get("api/users/my/schedule", {
    params: { start, end },
  });
  return res.data.content;
};