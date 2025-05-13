import React from "react";

type SelectProps = {
  label?: string;
  width?: string;
  error?: string;
  options: { label: string; value: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({label, width, error, options, ...props}: SelectProps) => {
  return (
    <div className="flex flex-col gap-0.5"
      style={width ? { width } : undefined}
    >
      {label && <label className="font-semibold text-md- pb-0.5">{label}</label>}
      <select
        {...props}
        className="border border-2 border-gray-300 w-full h-[48px]  rounded-xl px-2 text-sm"
      >
        <option value="">선택</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="pl-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Select;
