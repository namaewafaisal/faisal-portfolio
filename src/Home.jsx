import React from 'react'

function Home() {
  return (
    // Added id="home" to make this section targetable for scrolling
    <div id="home" className="min-h-screen flex flex-col justify-center items-center text-white px-4">
    <h1 className="text-5xl font-bold mb-4">Hi, I’m Mohamed Faisal</h1>
    <p className="max-w-xl text-center text-lg mb-6">
      Java Developer and Linux enthusiast passionate about building scalable backend applications and improving problem-solving skills.
    </p>
  </div>
  )
}

export default Home