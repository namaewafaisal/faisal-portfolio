import React from 'react'

function Home() {
  return (
    <>
    <div id="home" className="min-h-screen flex flex-col justify-center items-center text-white px-4">
    <h1 className="text-5xl font-bold mb-4">Hi, I’m Mohamed Faisal</h1>
    <p className="max-w-xl text-center text-lg mb-6">
      Java Developer and Linux enthusiast passionate about building scalable backend applications and improving problem-solving skills.
    </p>
    <a
      href={`${import.meta.env.BASE_URL}/Mohamed-Faisal-Resume.pdf`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Download Resume
    </a>

    </div>
  </>
  )
}

export default Home