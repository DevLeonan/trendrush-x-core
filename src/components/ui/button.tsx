"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-muted",
        destructive: "bg-brand-red text-white hover:bg-brand-red/90 hover:shadow-[0_0_15px_rgba(255,46,99,0.4)]",
        outline: "border border-border bg-transparent hover:bg-card hover:text-foreground",
        secondary: "bg-card text-foreground hover:bg-border",
        ghost: "hover:bg-card hover:text-foreground",
        link: "text-brand-blue underline-offset-4 hover:underline",
        premium: "bg-gradient-premium text-white shadow-glass hover:shadow-neon-purple border border-white/10",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-14 rounded-xl px-10 text-base font-semibold",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <motion.div
        whileTap={!props.disabled && !isLoading ? { scale: 0.97 } : undefined}
        className="inline-block w-full sm:w-auto"
      >
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          disabled={isLoading || props.disabled}
          {...props}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : null}
          {children}
        </Comp>
      </motion.div>
    );
  }
);
Button.displayName = "Button";