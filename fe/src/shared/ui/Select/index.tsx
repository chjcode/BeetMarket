import React from "react";

type SelectProps = {
  label?: string;
  width?: string;
  success?: string;
  error?: string;
  options: { label: string; value: string }[];
} & React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({
  label,
  width,
  success,
  error,
  options,
  ...props
}: SelectProps) => {
  return (
    <div
      className="flex flex-col gap-0.5"
      style={width ? { width } : undefined}
    >
      {label && <label className="font-semibold text-md pb-0.5">{label}</label>}
      <select
        {...props}
        className="border border-2 border-gray-300 w-full h-[48px] rounded-xl px-2 text-sm"
      >
        <option value="">선택</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pl-2 text-sm">
        <div className="text-green-500">{success}</div>
        <div className="text-red-500">{error}</div>
      </div>
    </div>
  );
};

export default Select;
