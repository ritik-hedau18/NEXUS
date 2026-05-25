import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextType>({
  open: false,
  setOpen: () => {},
})

function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

function DropdownMenuTrigger({ children, className }: DropdownMenuTriggerProps) {
  const { open, setOpen } = React.useContext(DropdownMenuContext)

  return (
    <div
      className={cn("cursor-pointer", className)}
      onClick={() => setOpen(!open)}
    >
      {children}
    </div>
  )
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
  sideOffset?: number
}

function DropdownMenuContent({
  children,
  className,
  align = "end",
  ...props
}: DropdownMenuContentProps) {
  const { open, setOpen } = React.useContext(DropdownMenuContext)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.parentElement?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-lg border border-white/10 bg-[#12121a] backdrop-blur-xl p-1 shadow-xl animate-fade-in",
        align === "end" && "right-0",
        align === "start" && "left-0",
        align === "center" && "left-1/2 -translate-x-1/2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean
}

function DropdownMenuItem({ className, disabled, onClick, ...props }: DropdownMenuItemProps) {
  const { setOpen } = React.useContext(DropdownMenuContext)

  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-white/10 focus:bg-white/10",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        setOpen(false)
      }}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-white/10", className)} {...props} />
  )
}

function DropdownMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-2 py-1.5 text-sm font-semibold text-muted-foreground", className)} {...props} />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
}
