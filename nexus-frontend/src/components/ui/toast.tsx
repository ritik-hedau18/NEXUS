import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface ToastProps {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
}

interface ToastContextType {
  toasts: ToastProps[]
  toast: (props: Omit<ToastProps, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  toast: () => {},
  dismiss: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-4 shadow-lg animate-slide-in-left min-w-[320px] max-w-[420px] backdrop-blur-xl",
              t.variant === "destructive"
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : t.variant === "success"
                ? "border-green-500/30 bg-green-500/10 text-green-300"
                : "border-white/10 bg-[#12121a]/95 text-foreground"
            )}
          >
            <div className="flex-1">
              {t.title && <div className="text-sm font-semibold">{t.title}</div>}
              {t.description && (
                <div className="text-sm text-muted-foreground mt-1">{t.description}</div>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
