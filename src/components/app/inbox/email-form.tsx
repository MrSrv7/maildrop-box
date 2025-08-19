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
    <form
      className={`max-w-lg mx-auto px-4 ${className}`}
      onSubmit={e => {
        e.preventDefault();
        if (!error && email.length > 0) handleSubmit();
      }}
      autoComplete="off"
    >
      {/* Desktop Layout */}
      <div className="hidden sm:block">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Enter or paste email address..."
            value={email}
            onChange={handleInputChange}
            variant={error ? "error" : "default"}
            error={error}
            fullWidth
            className="w-full"
          />
          <div className="flex gap-2 justify-center mt-3 mb-2">
            <Button
              type="button"
              onClick={handlePaste}
              variant="ghost"
              icon={Clipboard}
              size="icon"
              title="Paste from clipboard"
            />
            <Button
              type="submit"
              variant="primary"
              icon={ArrowRight}
              size="icon"
              disabled={!!error || !email.length}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden space-y-3">
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Enter or paste email address..."
            value={email}
            onChange={handleInputChange}
            variant={error ? "error" : "default"}
            error={error}
            fullWidth
            className="w-full"
          />
          <div className="flex gap-2 justify-center mt-3 mb-2">
            <Button
              type="button"
              onClick={handlePaste}
              variant="outline"
              icon={Clipboard}
              size="icon"
              title="Paste from clipboard"
            />
            <Button
              type="submit"
              variant="primary"
              icon={ArrowRight}
              size="icon"
              disabled={!!error || !email.length}
            />
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 px-2">
        {helperText}
      </p>
    </form>
  );
};

export default EmailForm;
