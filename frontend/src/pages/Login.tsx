import { useState } from "react"
import type React from "react"
import { csrfFetch, restoreCSRF } from "../features/csrf/csrf"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../app/hooks"
import { useAppSelector } from "../app/hooks"
import type { RootState } from "../app/store"
import { loginAsync } from "../features/session/sessionSlice"
import Cookies from "js-cookie"

export type LoginCredentials = {
  email: string
  password: string
}

function Login() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })

  const status = useAppSelector((state: RootState) => state.session.status)
  const error = useAppSelector((state: RootState) => state.session.error)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials({
      ...credentials,
      [name]: value,
    })
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    restoreCSRF()
      .then(res => res.json())
      .then(res => {
        Cookies.set("XSRF-TOKEN", res.cookie)
      })
    try {
      await dispatch(loginAsync(credentials)).unwrap()

      navigate("/home")
    } catch (err) {
      console.error("Login failed:", error)
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {/* {errors.length > 0 && (
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )} */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Logging in..." : "Login"}
          </button>
          {status === "failed" && error && <div>{error}</div>}
        </div>
      </form>
    </div>
  )
}

export default Login
