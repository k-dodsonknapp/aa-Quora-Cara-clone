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

  if (!response.ok) {
    throw new Error(`Login failed. Status code: ${response.status}`)
  }

  const data = await response.json()
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
