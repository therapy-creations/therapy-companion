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
        // This is exactly like the 'red test'. 
        // It injects the style directly into the HTML tag.
        actionButtonStyle: {
          backgroundColor: '#adb8ed',
          background: '#adb8ed',
          color: '#ffffff',
        },
        // Apply to the toast card itself for consistency
        style: {
          borderRadius: '0.75rem',
        }
      }}
      {...props}
    />
  )
}

export { Toaster }
