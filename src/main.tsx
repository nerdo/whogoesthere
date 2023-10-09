import { Auth } from './components'
import { Home, About, Layout, Contact, ErrorPage } from './pages'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import React from 'react'
import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/about',
    element: (
      <Layout>
        <About />
      </Layout>
    ),
  },
  {
    path: '/contact',
    element: (
      <Layout>
        <Contact />
      </Layout>
    ),
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth>
      <RouterProvider router={router} />
    </Auth>
  </React.StrictMode>
)
