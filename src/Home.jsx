import React from 'react'

function Home() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.BASE_URL}/Mohamed-Faisal-Resume.pdf`;
    link.download = "Mohamed-Faisal-Resume.pdf"; // force download with filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
    <div id="home" className="min-h-screen flex flex-col justify-center items-center text-white px-4">
    <h1 className="text-5xl font-bold mb-4">Hi, I’m Mohamed Faisal</h1>
    <p className="max-w-xl text-center text-lg mb-6">
      Java Developer and Linux enthusiast passionate about building scalable backend applications and improving problem-solving skills.
    </p>
    <div className='flex space-x-4'>
    <a
      href={`${import.meta.env.BASE_URL}/Mohamed-Faisal-Resume.pdf`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-600  text-white font-bold py-2 px-4 rounded transition-transform duration-100 hover:scale-110"
    >
      View Resume
    </a>
    <button
        onClick={handleDownload}
        className="bg-green-600 text-white font-bold py-2 px-4 rounded transition-transform duration-100 hover:scale-110"
    >
      Download Resume
    </button>
    </div>

    </div>
  </>
  )
}

export default Home