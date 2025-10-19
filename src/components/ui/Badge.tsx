import type { HTMLAttributes, ReactNode } from "react"
import { forwardRef } from "react"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** バッジのバリアント */
    variant?: "default" | "positive" | "negative" | "warning" | "info" | "outline"

    /** バッジのサイズ */
    size?: "sm" | "md" | "lg"

    /** ドット（インジケーター）を表示するか */
    dot?: boolean

    /** 子要素 */
    children?: ReactNode
}

const variantStyles = {
    default: "bg-white/10 text-foreground border border-white/10",
    positive: "bg-[rgb(var(--positive))]/10 text-[rgb(var(--positive))] border border-[rgb(var(--positive))]/20",
    negative: "bg-[rgb(var(--negative))]/10 text-[rgb(var(--negative))] border border-[rgb(var(--negative))]/20",
    warning: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
    info: "bg-[rgb(var(--accent))]/10 text-[rgb(var(--accent))] border border-[rgb(var(--accent))]/20",
    outline: "bg-transparent text-[rgb(var(--foreground-secondary))] border border-border"
}

const sizeStyles = {
    sm: "px-2 py-0.5 text-caption",
    md: "px-2.5 py-1 text-footnote",
    lg: "px-3 py-1.5 text-subhead"
}

const dotColors = {
    default: "bg-foreground",
    positive: "bg-[rgb(var(--positive))]",
    negative: "bg-[rgb(var(--negative))]",
    warning: "bg-yellow-500",
    info: "bg-[rgb(var(--accent))]",
    outline: "bg-[rgb(var(--foreground-secondary))]"
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(({
                                                                  variant = "default",
                                                                  size = "md",
                                                                  dot = false,
                                                                  className = "",
                                                                  children,
                                                                  ...props
                                                              }, ref) => {
    return (
        <span
            ref={ref}
            className={`
        inline-flex items-center gap-1.5
        font-medium rounded-md
        transition-colors
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
            {...props}
        >
      {dot && (
          <span
              className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
              aria-hidden="true"
          />
      )}
            {children}
    </span>
    )
})

Badge.displayName = "Badge"

// 型定義のエクスポート
export type { BadgeProps }