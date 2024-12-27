import { useNavigate } from "react-router-dom"

interface LogoutEvent extends React.MouseEvent<HTMLButtonElement> {}

function Navbar() {
  const navigate = useNavigate()
  async function handleLogout(e: LogoutEvent): Promise<void> {
    e.preventDefault()

    //TODO - implement logic to end session on backend

    navigate("/")
  }
  return (
    <nav>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  )
}

export default Navbar
