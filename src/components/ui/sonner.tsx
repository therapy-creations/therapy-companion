// Simple wrapper around sonner's Toaster
// This allows the UI component to be imported from @/components/ui/sonner
// while the actual toast functionality comes from the sonner package
import { Toaster as SonnerToaster } from "sonner"

export const Toaster = SonnerToaster

export default Toaster
