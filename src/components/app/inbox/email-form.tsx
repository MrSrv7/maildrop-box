"use client";

import React from "react";
import { Clipboard, ArrowRight } from "lucide-react";

import { Input, Button } from "@/components";
import { useEmailForm, useClipboard } from "@/hooks";
import { EMAIL_DOMAIN } from "@/utils";

interface EmailFormProps {
  /**
   * Domain to be used for email validation
   * @default EMAIL_DOMAIN
   */
  domain?: string;

  /**
   * Text shown below the input field
   */
  helperText?: string;

  /**
   * Callback function when form is submitted
   */
  onSubmit?: (username: string) => void;

  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * A reusable email form component for maildrop email handling
 */
export const EmailForm: React.FC<EmailFormProps> = ({
  domain = EMAIL_DOMAIN,
  helperText = `Enter a username (e.g. "example") or a full email address ending in @${domain}`,
  onSubmit,
  className = "",
}) => {
  const { email, error, handleInputChange, handleSubmit } = useEmailForm({
    onSubmit,
    domain,
  });

  const { pasteFromClipboard } = useClipboard();

  /**
   * Handle paste button click
   */
  const handlePaste = async () => {
    const text = await pasteFromClipboard();
    if (text) {
      // Directly update email state in the form hook
      handleInputChange({
        target: { value: text },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className={`max-w-lg mx-auto px-4 ${className}`}>
      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="Enter or paste email address..."
            value={email}
            onChange={handleInputChange}
            variant={error ? "error" : "default"}
            error={error}
            fullWidth
            className="flex-1"
          />
          <Button
            onClick={handlePaste}
            variant="ghost"
            icon={Clipboard}
            size="icon"
            title="Paste from clipboard"
          />
          <Button
            onClick={handleSubmit}
            variant="primary"
            icon={ArrowRight}
            size="icon"
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3">
        <Input
          type="text"
          placeholder="Enter or paste email address..."
          value={email}
          onChange={handleInputChange}
          variant={error ? "error" : "default"}
          error={error}
          fullWidth
        />
        <div className="flex gap-2 justify-center">
          <Button
            onClick={handlePaste}
            variant="outline"
            icon={Clipboard}
            size="icon"
            title="Paste from clipboard"
          />
          <Button
            onClick={handleSubmit}
            variant="primary"
            icon={ArrowRight}
            size="icon"
          />
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 px-2">
        {helperText}
      </p>
    </div>
  );
};

export default EmailForm;
