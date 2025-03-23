
import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";

type ButtonLinkProps = LinkProps & 
  React.ButtonHTMLAttributes<HTMLAnchorElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient";
    size?: "default" | "sm" | "lg" | "icon" | "xl";
    rounded?: "default" | "full" | "lg" | "xl";
    className?: string;
    asChild?: boolean;
  };

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ to, className, variant = "default", size = "default", rounded = "default", children, ...props }, ref) => {
    return (
      <Link
        to={to}
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, rounded, className })
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }
);

ButtonLink.displayName = "ButtonLink";

export { ButtonLink };
