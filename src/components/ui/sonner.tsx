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
        // THIS IS THE "RED TEST" IN CODE FORM:
        // These styles are applied directly to the button/link 
        // as inline styles, which beats any external CSS file.
        actionButtonStyle: {
          backgroundColor: '#adb8ed', // Your Periwinkle HSL(227, 58%, 80%)
          color: '#ffffff',
          borderRadius: '0.75rem',
        },
        cancelButtonStyle: {
          backgroundColor: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
          borderRadius: '0.75rem',
        },
        style: {
          borderRadius: '0.75rem',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
