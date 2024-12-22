import Cookies from "js-cookie"

// DEVELOPMENT
// Call this to get the "XSRF-TOKEN" cookie, should only be used in development
export function restoreCSRF(): Promise<Response> {
  return csrfFetch("/api/csrf/restore")
}
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  headers?: Record<string, string>
  body?: string
  credentials?: "include" | "same-origin" | "omit"
}

// Enhanced csrfFetch function with TypeScript support
export async function csrfFetch(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  // Default to "GET" method if none is provided
  options.method = options.method || "GET"

  // Initialize headers if not already present
  options.headers = options.headers || {}

  // For non-GET requests, set Content-Type and XSRF-Token headers
  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json"
    options.headers["XSRF-Token"] = Cookies.get("XSRF-TOKEN") || ""
  }

  // Perform the fetch request
  const res = await window.fetch(url, options)

  // If the response status is 400 or higher, throw the response object
  if (res.status >= 400) throw res

  // Return the response object if no errors
  return res
}
