import type { ButtonHTMLAttributes, ReactNode } from "react"
import { forwardRef } from "react"
import type { LucideIcon } from "lucide-react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** ボタンのバリアント */
    variant?: "primary" | "secondary" | "ghost" | "danger" | "success"

    /** ボタンのサイズ */
    size?: "sm" | "md" | "lg"

    /** 全幅にするか */
    fullWidth?: boolean

    /** ローディング状態 */
    loading?: boolean

    /** 左側のアイコン */
    leftIcon?: LucideIcon

    /** 右側のアイコン */
    rightIcon?: LucideIcon

    /** 子要素 */
    children?: ReactNode
}

const variantStyles = {
    primary: "bg-[rgb(var(--accent))] hover:bg-[rgb(var(--accent-hover))] text-white shadow-lg shadow-[rgb(var(--accent))]/20",
    secondary: "bg-white/5 hover:bg-white/10 text-foreground border border-white/10",
    ghost: "bg-transparent hover:bg-white/5 text-[rgb(var(--foreground-secondary))] hover:text-foreground",
    danger: "bg-[rgb(var(--negative))]/10 hover:bg-[rgb(var(--negative))]/20 text-[rgb(var(--negative))] border border-[rgb(var(--negative))]/20",
    success: "bg-[rgb(var(--positive))]/10 hover:bg-[rgb(var(--positive))]/20 text-[rgb(var(--positive))] border border-[rgb(var(--positive))]/20"
}

const sizeStyles = {
    sm: "px-3 py-1.5 text-footnote",
    md: "px-4 py-2.5 text-subhead",
    lg: "px-6 py-3 text-callout"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
                                                                      variant = "primary",
                                                                      size = "md",
                                                                      fullWidth = false,
                                                                      loading = false,
                                                                      leftIcon: LeftIcon,
                                                                      rightIcon: RightIcon,
                                                                      disabled,
                                                                      className = "",
                                                                      children,
                                                                      ...props
                                                                  }, ref) => {
    const isDisabled = disabled || loading

    return (
        <button
            ref={ref}
            disabled={isDisabled}
            className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-xl
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]/50 focus:ring-offset-2 focus:ring-offset-background
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}

            {!loading && LeftIcon && (
                <LeftIcon className="w-4 h-4" strokeWidth={2.5} />
            )}

            {children}

            {!loading && RightIcon && (
                <RightIcon className="w-4 h-4" strokeWidth={2.5} />
            )}
        </button>
    )
})

Button.displayName = "Button"

// 型定義のエクスポート
export type { ButtonProps }