import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-98",
          {
            "bg-primary text-primary-foreground shadow-sm hover:bg-primary/95":
              variant === "default",
            "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90":
              variant === "destructive",
            "border border-border/40 bg-transparent text-foreground shadow-xs hover:bg-secondary hover:text-secondary-foreground":
              variant === "outline",
            "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80":
              variant === "secondary",
            "hover:bg-secondary hover:text-foreground text-muted-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
            "bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-md hover:from-violet-700 hover:via-indigo-700 hover:to-blue-700 hover:shadow-lg transition-all duration-300":
              variant === "gradient",
          },
          {
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-md px-3 text-xs": size === "sm",
            "h-10 rounded-md px-8": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
