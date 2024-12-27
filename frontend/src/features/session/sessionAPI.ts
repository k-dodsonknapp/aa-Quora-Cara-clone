import type { LoginCredentials } from "../../pages/Login"
import { csrfFetch } from "../csrf/csrf"

export const fetchLogin = async (credentials: LoginCredentials) => {
  const response = await csrfFetch("http://localhost:8080/api/login", {
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

