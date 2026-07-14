import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="relative w-full flex flex-col gap-1">
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-muted">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-12 w-full rounded-lg border border-border bg-card/50 px-4 py-2 text-sm text-foreground shadow-sm transition-all backdrop-blur-md file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-blue focus-visible:border-brand-blue disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "border-brand-red focus-visible:ring-brand-red focus-visible:border-brand-red",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-brand-red mt-1 ml-1 animate-fade-in-up">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";