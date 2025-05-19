interface ButtonProps {
  width?: string | number;
  height?: string | number;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  width = "100%",
  height = "48px",
  label,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      style={{
        width,
        height,
        backgroundColor: disabled ? "#ccc" : "#a64ca6",
        color: "#fff",
        border: "none",
        borderRadius: "0.5rem",
        fontSize: "1.15em",
        fontWeight: "500",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.7 : 1,
      }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
