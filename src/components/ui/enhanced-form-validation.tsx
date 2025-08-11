import React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface ValidationFeedbackProps {
  isValid?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  isValid,
  error,
  hint,
  className = ""
}) => {
  if (error) {
    return (
      <div className={`flex items-center space-x-2 text-red-500 text-sm ${className}`} role="alert">
        <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>{error}</span>
      </div>
    );
  }

  if (isValid) {
    return (
      <div className={`flex items-center space-x-2 text-green-500 text-sm ${className}`}>
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>Campo válido</span>
      </div>
    );
  }

  if (hint) {
    return (
      <div className={`flex items-center space-x-2 text-muted-foreground text-sm ${className}`}>
        <Info className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>{hint}</span>
      </div>
    );
  }

  return null;
};

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  error,
  hint,
  required = false,
  className = ""
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="Campo obrigatório">*</span>
        )}
      </label>
      {children}
      <ValidationFeedback error={error} hint={hint} />
    </div>
  );
};

// Utilities for common validations
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validatePhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
};

export const validateName = (name: string): boolean => {
  return /^[a-zA-ZÀ-ÿ\s]{2,}$/.test(name.trim()) && name.trim().length >= 2;
};

export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};