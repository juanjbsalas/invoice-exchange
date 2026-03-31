"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C805]/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary — exact #00C805 neon green from style guide
        default:
          "bg-[#00C805] text-white hover:bg-[#00B304] active:bg-[#009A03] shadow-sm",
        // Secondary — Secondary Accent 1 #29B374
        secondary:
          "bg-ix-mint-600 text-white hover:bg-ix-mint-700 border border-ix-mint-500",
        outline:
          "border border-surface-300 bg-transparent hover:bg-surface-100 text-surface-700",
        ghost: "hover:bg-surface-100 text-surface-700",
        danger: "bg-danger text-white hover:opacity-90",
        accent:
          "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-600",
        // Premium — gradient matching Enter Portal / hero accent
        premium:
          "bg-gradient-to-r from-[#00C805] to-[#4A90E2] text-white hover:opacity-90 active:opacity-80 shadow-md",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
