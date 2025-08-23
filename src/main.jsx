import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './Home.jsx'
import About from './About.jsx'
import Projects from './ProjectsPage.jsx'
import Contact from './Contact.jsx'

const router = createBrowserRouter([
  {
    path: 'faisal-portfolio',
    element: <App />,  // App wraps navbar + Outlet
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'projects', element: <Projects /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
  {
    basename: import.meta.env.DEV ? "/" : "/faisal-portfolio/"
  },
]);

  // The error “Absolute route path '/' nested under path '/faisal-portfolio/' is not valid…”
  // occurs because child routes in React Router v6+ must be relative.
  // Leading slashes ("/") define absolute paths and violate the nesting rule.
  // See Stack Overflow: “Absolute child route path must start with the combined path of all its parent routes.” :contentReference[oaicite:0]{index=0}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
