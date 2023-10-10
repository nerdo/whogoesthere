import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface LayoutProps {
  children: ReactNode | undefined
}

export const Layout = (props: LayoutProps) => {
  const { children } = props

  return (
    <>
      <div className="flex bg-white pt-16 p-16">
        <aside className="fixed h-full top-0 left-10 pt-16 flex lg:flex flex-shrink-0 flex-col w-64">
          <nav>
            <ol>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ol>
          </nav>
        </aside>
        <main className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64">{children}</main>
      </div>
    </>
  )
}

export default Layout
