interface ButtonProps {
  width?: string | number;
  height?: string | number;
  label: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ width = '100%', height = '48px', label, onClick }) => {
  return (
    <button
      style={{
        width,
        height,
        backgroundColor: '#a64ca6',
        color: '#fff',
        border: 'none',
        borderRadius: '0.5rem',
        fontSize: '1.15em',
        fontWeight: '500',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
