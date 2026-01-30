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
        // STYLES: This property injects CSS directly into the button's 'style' attribute
        actionButtonStyle: {
          background: 'hsl(227, 58%, 80%)',
          backgroundColor: 'hsl(227, 58%, 80%)',
          color: '#ffffff',
        },
        cancelButtonStyle: {
          background: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
        },
        classNames: {
          toast: "group toast",
          actionButton: "group-[.toast]:!bg-[hsl(227,58%,80%)] group-[.toast]:!text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
