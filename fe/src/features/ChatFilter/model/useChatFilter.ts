import { useState } from "react"

export type ChatFilterType = "전체" | "구매" | "판매";

export const useChatFilter = () => {
    const [filter, setFilter] = useState<ChatFilterType>("전체");
    return { filter, setFilter }
}