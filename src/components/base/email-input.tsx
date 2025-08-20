"use client";

import React from "react";
import Input, { InputProps } from "./input";

export interface EmailInputProps extends Omit<InputProps, "type"> {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  placeholder?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({
  value,
  onChange,
  onKeyPress,
  autoFocus = false,
  placeholder = "Enter username...",
  ...props
}) => (
  <Input
    type="text"
    value={value}
    onChange={e => onChange(e)}
    onKeyUp={onKeyPress}
    autoFocus={autoFocus}
    placeholder={placeholder}
    fullWidth
    {...props}
  />
);

export default EmailInput;
