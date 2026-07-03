import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

// Discriminated on `href`: present → <Link>, absent → <button>.
type LinkButtonProps = CommonProps & ComponentPropsWithoutRef<typeof Link>;
type NativeButtonProps = CommonProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };

type ButtonProps = LinkButtonProps | NativeButtonProps;

const BASE_CLASSES =
  "inline-flex items-center justify-center gap-2 rounded-xs font-display text-sm tracking-etched uppercase transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid:
    "bg-accent text-surface hover:bg-accent-bright hover:-translate-y-0.5 hover:shadow-glow",
  outline:
    "border border-foreground/30 text-foreground hover:border-accent hover:text-accent hover:-translate-y-0.5 hover:shadow-glow",
  ghost: "text-foreground/70 hover:text-accent",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-5 py-2.5",
  lg: "px-7 py-3.5",
};

export function Button({
  variant = "solid",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );

  if (props.href !== undefined) {
    return <Link {...props} className={classes} />;
  }

  return <button {...props} className={classes} />;
}
