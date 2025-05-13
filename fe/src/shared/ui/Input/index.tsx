import React from "react";

type InputProps = {
  label?: string;
  width?: string;
  success?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({label, width, success, error, ...props}: InputProps) => {
  return (
    <div className="flex flex-col gap-0.5"
      style={width ? {width} : undefined}
    >
      {label && <label className="font-semibold text-md pb-0.5">{label}</label>}
      <input 
        {...props}
        className="border border-2 border-gray-300 w-full h-[48px] rounded-xl px-2 text-sm"
        maxLength={16}
        />
      <div className="pl-2 text-sm">
        <div className="text-green-500">{success}</div>
        <div className="text-red-500">{error}</div>
      </div>
    </div>
  );
};

export default Input;