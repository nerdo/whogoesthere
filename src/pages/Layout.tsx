import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface LayoutProps {
  children: ReactNode | undefined
}

export const Layout = (props: LayoutProps) => {
  const { children } = props

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <main>{children}</main>
    </>
  )
}

export default Layout
