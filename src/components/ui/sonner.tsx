"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = (props: ToasterProps) => (
  <Sonner
    theme="light"
    position="bottom-center"
    gap={8}
    toastOptions={{
      classNames: {
        toast:
          "!rounded-xl !border-border !bg-card !text-foreground !shadow-[var(--shadow-float)] !font-sans !text-sm",
        description: "!text-muted-foreground",
        success: "[&_[data-icon]]:!text-success",
        error: "[&_[data-icon]]:!text-destructive",
      },
    }}
    {...props}
  />
)

export { Toaster }
