import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "sonner"
import App from "./App.tsx"
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/600.css"
import "@fontsource/plus-jakarta-sans/600.css"
import "@fontsource/plus-jakarta-sans/700.css"
import "@fontsource/plus-jakarta-sans/800.css"
import "@fontsource/playfair-display/700.css"
import "./styles/globals.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          borderRadius: "12px",
          fontFamily: "Inter, sans-serif",
        },
      }}
    />
  </StrictMode>
)
