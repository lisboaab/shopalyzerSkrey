import React from "react";
import { useState } from "react";

interface InputProps {
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: () => void;
  onClick?: () => void;
}

const CustomInput: React.FC<InputProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  onClick
}) => {
  const [hover, setHover] = useState(false);

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="gellix w-full bg-transparent outline-none"
      onClick={onClick}
    />
  )
};
export default CustomInput;
