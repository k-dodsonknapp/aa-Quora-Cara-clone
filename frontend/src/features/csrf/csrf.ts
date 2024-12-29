import Cookies from "js-cookie"

// DEVELOPMENT
// Call this to get the "XSRF-TOKEN" cookie, should only be used in development
export function restoreCSRF(): Promise<Response> {
  return csrfFetch("http://localhost:8080/api/csrf/restore")
}
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  headers?: Record<string, string>
  body?: string
  credentials?: "include" | "same-origin" | "omit"
}


export async function csrfFetch(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  // Default to "GET" method if none is provided
  options.method = options.method || "GET"

  // Initialize headers if not already present
  options.headers = options.headers || {}

  // For non-GET requests, set Content-Type and XSRF-TOKEN headers
  if (options.method.toUpperCase() !== "GET") {
    options.headers["Content-Type"] =
      options.headers["Content-Type"] || "application/json"
    options.headers["XSRF-TOKEN"] = Cookies.get("XSRF-TOKEN") || ""
  }
  options.credentials = "include"
  // Perform the fetch request
  const res = await window.fetch(url, options)

  // If the response status is 400 or higher, throw the response object
  if (res.status >= 400) {
    const data = await res.json()
    const errorMessage =
      data.errors?.length > 0
        ? data.errors[0]
        : "An error occurred. Please try again."

    throw new Error(errorMessage)
  }

  // Return the response object if no errors
  return res
}
