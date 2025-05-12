import { useEffect, useState, useRef } from "react";

export const useCategoryIndicator = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      const percent = el.scrollLeft / maxScroll;
      setScrollPercent(Math.min(1, Math.max(0, percent)));
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollRef, scrollPercent };
};
