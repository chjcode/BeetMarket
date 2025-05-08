import React from 'react';

interface InputTextFieldProps {
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputTextField: React.FC<InputTextFieldProps> = ({ label, placeholder, value, onChange }) => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-lg font-bold">{label}</label>
        <input
          className="border-3 border-[#CBCBCB] focus:outline-none focus:border-3 rounded-xl px-4 py-3 placeholder-[#8B8B8B] text-[#000000]"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    );
};

export default InputTextField;