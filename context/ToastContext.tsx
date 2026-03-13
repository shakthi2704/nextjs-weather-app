// src/context/ToastContext.tsx
"use client"

import { createContext, useContext, useState, useCallback, useRef } from "react"

// ── Types ──────────────────────────────────────
export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  toasts: Toast[]
  toast: (message: string, type?: ToastType) => void
  dismiss: (id: string) => void
}

// ── Context ────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null)

// ── Config ─────────────────────────────────────
const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
}

const COLORS: Record<
  ToastType,
  { bg: string; border: string; icon: string; text: string }
> = {
  success: {
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.25)",
    icon: "rgba(34,197,94,0.9)",
    text: "#86efac",
  },
  error: {
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
    icon: "rgba(239,68,68,0.9)",
    text: "#fca5a5",
  },
  info: {
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.25)",
    icon: "rgba(59,130,246,0.9)",
    text: "#93c5fd",
  },
  warning: {
    bg: "rgba(234,179,8,0.1)",
    border: "rgba(234,179,8,0.25)",
    icon: "rgba(234,179,8,0.9)",
    text: "#fde047",
  },
}

// ── Single Toast item ──────────────────────────
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: () => void
}) {
  const c = COLORS[toast.type]

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl min-w-[280px] max-w-[360px]
                 animate-in slide-in-from-right-8 fade-in duration-300"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Icon */}
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{ background: c.border, color: c.icon }}
      >
        {ICONS[toast.type]}
      </span>

      {/* Message */}
      <p className="text-sm font-medium flex-1" style={{ color: c.text }}>
        {toast.message}
      </p>

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="text-xs opacity-40 hover:opacity-80 transition-opacity shrink-0 ml-1"
        style={{ color: c.text }}
      >
        ✕
      </button>
    </div>
  )
}

// ── Provider ───────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev.slice(-3), { id, type, message }]) // max 4 at once

      const timer = setTimeout(() => dismiss(id), 4000)
      timers.current.set(id, timer)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}

      {/* Toast container — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used inside ToastProvider")
  return ctx.toast
}
