import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] py-3 w-full rounded-lg border border-input bg-card px-3.5 text-[15px] shadow-[var(--shadow-hairline)] transition-[border-color,box-shadow] duration-200 placeholder:text-zinc-400 hover:border-zinc-300 focus-visible:outline-hidden focus-visible:border-iris/60 focus-visible:ring-4 focus-visible:ring-iris/10 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
