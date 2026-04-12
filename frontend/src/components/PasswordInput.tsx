"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function PasswordInput({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  className = "",
  disabled,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${className}`}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}