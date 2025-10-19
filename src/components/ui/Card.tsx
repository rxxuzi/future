import type { HTMLAttributes, ReactNode } from "react"
import { forwardRef } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** カードのバリアント */
    variant?: "default" | "glass" | "gradient" | "outlined"

    /** カードのサイズ（パディング） */
    size?: "sm" | "md" | "lg"

    /** ホバー効果を有効にするか */
    hoverable?: boolean

    /** クリック可能にするか */
    clickable?: boolean

    /** 子要素 */
    children?: ReactNode
}

const variantStyles = {
    default: "bg-[rgb(var(--surface))] border border-border",
    glass: "glass-card",
    gradient: "bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10",
    outlined: "bg-transparent border-2 border-border"
}

const sizeStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
                                                               variant = "default",
                                                               size = "md",
                                                               hoverable = false,
                                                               clickable = false,
                                                               className = "",
                                                               children,
                                                               ...props
                                                           }, ref) => {
    return (
        <div
            ref={ref}
            className={`
        rounded-2xl
        transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${hoverable ? "hover:border-white/20 hover:shadow-lg" : ""}
        ${clickable ? "cursor-pointer active:scale-[0.98]" : ""}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    )
})

Card.displayName = "Card"

// CardHeader コンポーネント
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
                                                                           className = "",
                                                                           children,
                                                                           ...props
                                                                       }, ref) => {
    return (
        <div
            ref={ref}
            className={`mb-6 ${className}`}
            {...props}
        >
            {children}
        </div>
    )
})

CardHeader.displayName = "CardHeader"

// CardTitle コンポーネント
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    children?: ReactNode
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({
                                                                             className = "",
                                                                             children,
                                                                             ...props
                                                                         }, ref) => {
    return (
        <h3
            ref={ref}
            className={`text-title-3 text-foreground ${className}`}
            {...props}
        >
            {children}
        </h3>
    )
})

CardTitle.displayName = "CardTitle"

// CardDescription コンポーネント
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
    children?: ReactNode
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({
                                                                                           className = "",
                                                                                           children,
                                                                                           ...props
                                                                                       }, ref) => {
    return (
        <p
            ref={ref}
            className={`text-footnote text-[rgb(var(--foreground-tertiary))] mt-1 ${className}`}
            {...props}
        >
            {children}
        </p>
    )
})

CardDescription.displayName = "CardDescription"

// CardContent コンポーネント
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({
                                                                             className = "",
                                                                             children,
                                                                             ...props
                                                                         }, ref) => {
    return (
        <div
            ref={ref}
            className={className}
            {...props}
        >
            {children}
        </div>
    )
})

CardContent.displayName = "CardContent"

// CardFooter コンポーネント
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
                                                                           className = "",
                                                                           children,
                                                                           ...props
                                                                       }, ref) => {
    return (
        <div
            ref={ref}
            className={`mt-6 pt-6 border-t border-border ${className}`}
            {...props}
        >
            {children}
        </div>
    )
})

CardFooter.displayName = "CardFooter"

// 型定義のエクスポート
export type {
    CardProps,
    CardHeaderProps,
    CardTitleProps,
    CardDescriptionProps,
    CardContentProps,
    CardFooterProps
}