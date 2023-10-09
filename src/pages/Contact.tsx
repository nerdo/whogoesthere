import { WhosHere } from '../components'
import { useLocation } from 'react-router-dom'
import './pages.css'

export const Contact = () => {
  const location = useLocation()

  return (
    <>
      <h1>Contact</h1>
      <WhosHere path={location.pathname} />
    </>
  )
}

export default Contact
