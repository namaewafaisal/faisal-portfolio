import React from 'react'
// import { Link } from 'react-router-dom' // Commented out: Not needed for single-page scrolling

function Navbar() {
  return (
    <nav className="fixed top-0 w-full shadow-md flex justify-center space-x-6 py-4 bg-black bg-opacity-80 backdrop-blur-sm z-50">
      {/* New navigation with anchor links for scrolling */}
      <a href="#home" className="text-gray-300 hover:text-blue-300">Home</a>
      <a href="#about" className="text-gray-300 hover:text-blue-300">About</a>
      <a href="#projects" className="text-gray-300 hover:text-blue-300">Projects</a>
      <a href="#contact" className="text-gray-300 hover:text-blue-300">Contact</a>
    </nav>
  )
}

export default Navbar