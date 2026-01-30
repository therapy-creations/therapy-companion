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
        // INLINE STYLES: These are injected directly into the HTML elements
        // and usually override any external .css file.
        actionButtonStyle: {
          backgroundColor: 'hsl(227, 58%, 80%)',
          color: '#ffffff',
        },
        cancelButtonStyle: {
          backgroundColor: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
        },
        classNames: {
          toast: "group toast",
          // We keep the classes here just in case, but style takes precedence
          actionButton: "hover:!opacity-90 transition-opacity", 
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
