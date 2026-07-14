import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-purple",
  {
    variants: {
      variant: {
        default: "border-transparent bg-brand-blue text-background shadow",
        secondary: "border-transparent bg-card text-foreground",
        destructive: "border-transparent bg-brand-red text-white shadow-[0_0_10px_rgba(255,46,99,0.3)]",
        outline: "text-foreground border-border",
        success: "border-transparent bg-brand-green text-background shadow-[0_0_10px_rgba(0,255,153,0.3)]",
        premium: "border-transparent bg-gradient-premium text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}