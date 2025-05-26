interface InputTextFieldProps {
    label: string;
    placeholder?: string;
    value?: string;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: () => void;
}

const InputTextField: React.FC<InputTextFieldProps> = ({ label, placeholder, value, onChange, readOnly, onClick }) => {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-lg font-bold">{label}</label>
        <input
          className="border-3 border-[#CBCBCB] focus:outline-none focus:border-3 rounded-xl px-4 py-3 placeholder-[#8B8B8B] text-[#000000]"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          onClick={onClick}
        />
      </div>
    );
};

export default InputTextField;