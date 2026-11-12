import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-iris/15 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_2px_rgb(24_24_27/0.12),inset_0_1px_0_rgb(255_255_255/0.1)] hover:bg-primary/88",
        outline:
          "border border-input bg-card text-foreground shadow-[var(--shadow-hairline)] hover:border-zinc-300 hover:bg-zinc-50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-zinc-200/70",
        ghost: "text-muted-foreground hover:bg-zinc-100 hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_1px_2px_rgb(24_24_27/0.12)] hover:bg-destructive/90",
        link: "text-foreground underline decoration-zinc-300 underline-offset-4 hover:decoration-foreground",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-[13px]",
        lg: "h-11 px-5 text-[15px]",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
