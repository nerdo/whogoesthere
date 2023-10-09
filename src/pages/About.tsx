import { WhosHere } from '../components'
import { useLocation } from 'react-router-dom'
import './pages.css'

export const About = () => {
  const location = useLocation()

  return (
    <>
      <h1>About</h1>
      <WhosHere path={location.pathname} />
    </>
  )
}

export default About
