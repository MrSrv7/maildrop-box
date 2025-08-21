"use client";

import React from "react";
import { Clipboard, ArrowRight } from "lucide-react";

import { Input, Button } from "@/components";
import { LoadingSpinner } from "@/components/base/loading-spinner";
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
    const [loading, setLoading] = React.useState(false);

    /**
     * Handle paste button click
     */
    const handlePaste = async () => {
      const text = await pasteFromClipboard();
      if (text) {
        handleInputChange({
          target: { value: text },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    // Wrap handleSubmit to set loading state
    const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!error && email.length > 0) {
        setLoading(true);
        await Promise.resolve(handleSubmit());
      }
    };

    return (
      <form
        className={`max-w-lg mx-auto px-4 ${className}`}
        onSubmit={handleFormSubmit}
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
              disabled={loading}
            />
            <Button
              type="submit"
              variant="primary"
              icon={ArrowRight}
              size="icon"
              disabled={!!error || !email.length || loading}
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
              disabled={loading}
            />
            <Button
              type="submit"
              variant="primary"
              icon={ArrowRight}
              size="icon"
              disabled={!!error || !email.length || loading}
            />
          </div>
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 px-2">
        {helperText}
        {loading && (
          <div className="flex items-center justify-center mt-4">
            <span className="mr-2">
              <LoadingSpinner size="sm" variant="primary" />
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-medium">Redirecting to your mailbox...</span>
          </div>
        )}
      </p>
    </form>
  );
};

export default EmailForm;
