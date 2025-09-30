import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type StyleVariant = "primary" | "ghost";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: StyleVariant;
};

type LinkProps = SharedProps & {
  href: string;
  onClick?: never;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className">;

type ButtonProps = SharedProps & {
  href?: undefined;
  disabled?: boolean;
  onClick?: ComponentPropsWithoutRef<"button">["onClick"];
} & Omit<ComponentPropsWithoutRef<"button">, "onClick">;

export type FuturisticButtonProps = LinkProps | ButtonProps;

export function FuturisticButton(props: FuturisticButtonProps) {
  const variant = props.variant ?? "primary";

  const baseClasses = "relative group px-6 py-3 text-xs uppercase tracking-wide transition-all duration-200 focus:outline-none overflow-hidden";
  
  const primaryClasses = "bg-black/80 border border-white/95 text-white md:hover:bg-white/5 md:hover:border-white md:hover:text-white md:hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]";
  
  const ghostClasses = "bg-transparent border border-white/40 text-white/80 md:hover:border-white md:hover:text-white md:hover:bg-black/20";
  
  const disabledClasses = "opacity-40 cursor-not-allowed md:hover:bg-black/80 md:hover:border-white/95 md:hover:text-white md:hover:shadow-none";

  const rootClassName = cx(
    baseClasses,
    variant === "primary" ? primaryClasses : ghostClasses,
    "className" in props ? props.className : undefined,
  );

  const cornerElements = (
    <>
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/95 md:group-hover:border-white transition-colors duration-200" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/95 md:group-hover:border-white transition-colors duration-200" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/95 md:group-hover:border-white transition-colors duration-200" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/95 md:group-hover:border-white transition-colors duration-200" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] md:group-hover:translate-x-[200%] transition-transform duration-700 ease-out" />
    </>
  );

  if ("href" in props) {
    const { href, children, className: _className, variant: _variant, ...rest } = props as LinkProps;
    void _className;
    void _variant;
    return (
      <Link href={href} className={rootClassName} {...rest}>
        {cornerElements}
        <span className="relative z-10" style={{ fontFamily: 'var(--font-audiowide)' }}>{children}</span>
      </Link>
    );
  }

  const { children, disabled, className: _className, variant: _variant, onClick, ...rest } = props as ButtonProps;
  void _className;
  void _variant;

  return (
    <button
      type="button"
      className={cx(rootClassName, disabled && disabledClasses)}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {!disabled && cornerElements}
      <span className="relative z-10" style={{ fontFamily: 'var(--font-audiowide)' }}>{children}</span>
    </button>
  );
}
