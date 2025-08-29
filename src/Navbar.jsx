import React from 'react'
import ThemeToggle from './ThemeToggle'
// import { Link } from 'react-router-dom' // Commented out: Not needed for single-page scrolling

function Navbar() {
  return (
  <div className='fixed top-0 shadow-md flex justify-center w-full z-50 bg-opacity-80 backdrop-blur-sm'>
    <nav className="flex justify-center space-x-6 py-4 ">
      {/* New navigation with anchor links for scrolling */}
      <a href="#home" className="text-gray-300 hover:text-blue-300">Home</a>
      <a href="#about" className="text-gray-300 hover:text-blue-300">About</a>
      <a href="#projects" className="text-gray-300 hover:text-blue-300">Projects</a>
      <a href="#contact" className="text-gray-300 hover:text-blue-300">Contact</a>
    </nav>
    {/* <div className="justify-center ml-auto">
      <ThemeToggle />
    </div> */}
  </div>
  )
}

export default Navbar