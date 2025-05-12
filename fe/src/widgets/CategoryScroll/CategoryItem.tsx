export const CategoryItem = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center w-[60px] shrink-0">
    <div className="w-[40px] h-[40px] bg-gray-300 rounded-full" />
    <span className="mt-[4px] text-xs text-center whitespace-nowrap">{label}</span>
  </div>
);
