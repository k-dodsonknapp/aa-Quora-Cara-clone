import { useState } from "react"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: { preventDefault: () => void }) {
    e.preventDefault()

    // TODO handel submit
  }

  return (
    <div>
      <fieldset>
        <legend>Login</legend>
        <form>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="text"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </fieldset>
    </div>
  )
}
