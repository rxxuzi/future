"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "./Button"

interface ModalProps {
    /** モーダルを開くかどうか */
    isOpen: boolean

    /** モーダルを閉じる関数 */
    onClose: () => void

    /** モーダルのタイトル */
    title?: string

    /** モーダルの説明 */
    description?: string

    /** モーダルの子要素 */
    children: ReactNode

    /** フッター要素 */
    footer?: ReactNode

    /** モーダルのサイズ */
    size?: "sm" | "md" | "lg" | "xl" | "full"

    /** 背景クリックで閉じるかどうか */
    closeOnBackdropClick?: boolean

    /** 閉じるボタンを表示するかどうか */
    showCloseButton?: boolean

    /** カスタムクラス名 */
    className?: string
}

const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4"
}

export function Modal({
                          isOpen,
                          onClose,
                          title,
                          description,
                          children,
                          footer,
                          size = "md",
                          closeOnBackdropClick = true,
                          showCloseButton = true,
                          className = ""
                      }: ModalProps) {
    // ESCキーで閉じる
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose()
            }
        }

        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [isOpen, onClose])

    // body のスクロールを制御
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }

        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={closeOnBackdropClick ? onClose : undefined}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-description" : undefined}
        >
            <div
                className={`
          w-full bg-[rgb(var(--surface))] border border-border rounded-2xl
          shadow-2xl
          animate-in zoom-in-95 duration-200
          ${sizeStyles[size]}
          ${className}
        `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-start justify-between p-6 border-b border-border">
                        <div className="flex-1 pr-4">
                            {title && (
                                <h2
                                    id="modal-title"
                                    className="text-title-2 text-foreground"
                                >
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p
                                    id="modal-description"
                                    className="text-footnote text-[rgb(var(--foreground-tertiary))] mt-1"
                                >
                                    {description}
                                </p>
                            )}
                        </div>

                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-[rgb(var(--foreground-tertiary))] hover:text-foreground transition-colors p-1 rounded-lg hover:bg-white/5"
                                aria-label="閉じる"
                            >
                                <X className="w-5 h-5" strokeWidth={2} />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

// 便利な確認ダイアログコンポーネント
interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description?: string
    confirmText?: string
    cancelText?: string
    variant?: "danger" | "primary"
    loading?: boolean
}

export function ConfirmModal({
                                 isOpen,
                                 onClose,
                                 onConfirm,
                                 title,
                                 description,
                                 confirmText = "確認",
                                 cancelText = "キャンセル",
                                 variant = "primary",
                                 loading = false
                             }: ConfirmModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            description={description}
            size="sm"
            footer={
                <>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >
            {/* 追加のコンテンツがあればここに */}
        </Modal>
    )
}

// 型定義のエクスポート
export type { ModalProps, ConfirmModalProps }