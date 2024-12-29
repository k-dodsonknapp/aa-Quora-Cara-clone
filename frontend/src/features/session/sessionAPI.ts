import type { LoginCredentials } from "../../pages/Login"
import { csrfFetch, restoreCSRF } from "../csrf/csrf"

export const BASEURL = "http://localhost:8080/api"
export const fetchLogin = async (credentials: LoginCredentials) => {
  const response = await csrfFetch(`${BASEURL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  })
  const data = await response.json()
  if (!response.ok) {
    const errorMessage =
      data.errors?.length > 0
        ? data.errors[0]
        : ["An error occurred. Please try again."]

    throw new Error(errorMessage)
  }

  return data.user
}

export const fetchLogout = async () => {
  const response = await csrfFetch(`${BASEURL}/logout`, {
    method: "POST",
  })
  if (!response.ok) {
    throw new Error(`Logout failed. Status code: ${response.status}`)
  }
  restoreCSRF()
}
