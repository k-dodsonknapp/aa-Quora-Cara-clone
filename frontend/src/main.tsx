import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { store } from "./app/store"
import "./index.css"
import { csrfFetch, restoreCSRF } from "./features/csrf/csrf"

declare global {
  interface Window {
    store: typeof store
    csrfFetch: typeof csrfFetch
    sessionActions: any
  }
}

const container = document.getElementById("root")

if (process.env.NODE_ENV !== "production") {
  restoreCSRF()

  window.csrfFetch = csrfFetch
  window.store = store
  // TODO need to setup store for session
  // window.sessionActions = sessionActions
}

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
