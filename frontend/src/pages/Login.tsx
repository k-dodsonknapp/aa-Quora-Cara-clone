import { useState } from "react"
import type React from "react"
import { csrfFetch } from "../features/csrf/csrf"
import { useNavigate } from "react-router-dom"

interface LoginFormData {
  email: string
  password: string
}

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    try {
      const response = await csrfFetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })

      const result = await response.json()

      if (response.ok) {
        if (result.authenticated) {
          navigate("home")
        }
        setErrors([])
      } else {
        console.log("Login failed", result)
        setErrors(result.errors || ["Login failed."])
      }
    } catch (err) {
      console.error("Error during login", err)
      setErrors(["An unexpected error occurred"])
    } finally {
      setLoading(false) // Stop loading indicator
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {errors.length > 0 && (
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login
