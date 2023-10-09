import { WhosHere } from '../components'
import { useLocation } from 'react-router-dom'
import './pages.css'

export const Home = () => {
  const location = useLocation()

  return (
    <>
      <h1>Home</h1>
      <WhosHere path={location.pathname} />
    </>
  )
}

export default Home
