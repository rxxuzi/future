import type { InputHTMLAttributes, ReactNode } from "react"
import { forwardRef } from "react"
import type { LucideIcon } from "lucide-react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** 入力フィールドのラベル */
    label?: string

    /** エラーメッセージ */
    error?: string

    /** ヘルパーテキスト */
    helperText?: string

    /** 左側のアイコン */
    leftIcon?: LucideIcon

    /** 右側のアイコン */
    rightIcon?: LucideIcon

    /** 右側のアクション要素 */
    rightElement?: ReactNode

    /** 全幅にするか */
    fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
                                                                   label,
                                                                   error,
                                                                   helperText,
                                                                   leftIcon: LeftIcon,
                                                                   rightIcon: RightIcon,
                                                                   rightElement,
                                                                   fullWidth = false,
                                                                   className = "",
                                                                   disabled,
                                                                   ...props
                                                               }, ref) => {
    const hasError = !!error

    return (
        <div className={`${fullWidth ? "w-full" : ""}`}>
            {/* Label */}
            {label && (
                <label
                    className="block text-footnote font-medium text-[rgb(var(--foreground-secondary))] mb-2"
                    htmlFor={props.id}
                >
                    {label}
                    {props.required && (
                        <span className="text-[rgb(var(--negative))] ml-1" aria-label="必須">*</span>
                    )}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Left Icon */}
                {LeftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <LeftIcon
                            className="w-4 h-4 text-[rgb(var(--foreground-tertiary))]"
                            strokeWidth={2}
                        />
                    </div>
                )}

                {/* Input */}
                <input
                    ref={ref}
                    disabled={disabled}
                    className={`
            w-full px-4 py-2.5
            bg-white/5 border rounded-xl
            text-subhead text-foreground
            placeholder:text-[rgb(var(--foreground-tertiary))]
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
            disabled:opacity-50 disabled:cursor-not-allowed
            ${hasError
                        ? "border-[rgb(var(--negative))] focus:border-[rgb(var(--negative))] focus:ring-[rgb(var(--negative))]/50"
                        : "border-border focus:border-[rgb(var(--accent))] focus:ring-[rgb(var(--accent))]/50"
                    }
            ${LeftIcon ? "pl-10" : ""}
            ${RightIcon || rightElement ? "pr-10" : ""}
            ${className}
          `}
                    {...props}
                />

                {/* Right Icon */}
                {RightIcon && !rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <RightIcon
                            className="w-4 h-4 text-[rgb(var(--foreground-tertiary))]"
                            strokeWidth={2}
                        />
                    </div>
                )}

                {/* Right Element */}
                {rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightElement}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {hasError && (
                <p className="mt-1.5 text-footnote text-[rgb(var(--negative))]" role="alert">
                    {error}
                </p>
            )}

            {/* Helper Text */}
            {!hasError && helperText && (
                <p className="mt-1.5 text-footnote text-[rgb(var(--foreground-tertiary))]">
                    {helperText}
                </p>
            )}
        </div>
    )
})

Input.displayName = "Input"

// 型定義のエクスポート
export type { InputProps }