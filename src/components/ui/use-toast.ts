import { toast } from "sonner"

// Create a simple custom hook to maintain API compatibility
function useToast() {
  return {
    toast,
    // Add any other properties needed to maintain API compatibility
    toasts: [],
    dismiss: () => {}
  }
}

export { useToast, toast }
