import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Core "glass panel" styling
          "rounded-3xl border border-white/5 bg-slate-950/80",
          "shadow-[0_0_80px_rgba(15,23,42,0.8)]",
          "backdrop-blur-2xl",
          // Layout
          "px-6 py-6 sm:px-8 sm:py-7",
          // Premium hover: lift, ripple shadow, micro-tint
          "transition-all duration-300 ease-[0.23,1,0.32,1]",
          "hover:-translate-y-1 hover:border-white/15",
          "hover:shadow-[0_8_40px_rgba(20,80,255,0.15),0_0_120px_rgba(15,23,42,0.95)]",
          "hover:bg-slate-950/90",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col gap-1 mb-6 pb-6",
      className
    )}
    {...props}
  />
));

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-medium tracking-tight text-white mb-6 text-center",
      className
    )}
    {...props}
  />
));

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-[#BDC3D2] leading-[1.5] tracking-[-0.01em]",
      className
    )}
    {...props}
  />
));

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-0 space-y-6", className)}
    {...props}
  />
));

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex justify-between w-full items-center",
      className
    )}
    {...props}
  />
));

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
