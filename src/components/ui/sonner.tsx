import { Toaster as SonnerToaster } from "sonner"
import { useTheme } from "next-themes"

type ToasterProps = React.ComponentProps<typeof SonnerToaster>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <SonnerToaster
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          // THIS IS THE FIX: Target the button and use your primary HSL variable
          actionButton:
            "group-[.toast]:!bg-[hsl(var(--primary))] group-[.toast]:!text-[hsl(var(--primary-foreground))] font-medium",
          cancelButton:
            "group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
