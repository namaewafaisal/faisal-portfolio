import React from 'react'

function About() {
  return (
    // Added id="about" to make this section targetable for scrolling
    <>
    <div id="about" className="max-w-3xl mx-auto p-6 mb-10">
    <h2 className="text-3xl font-bold mb-4">About Me</h2>
    <p className="mb-4">
      I’m Mohamed Faisal, a dedicated Java backend developer currently pursuing my B.E. in Computer Science and Engineering from SRM TRP Engineering College. I am passionate about Linux customization and problem-solving using platforms like LeetCode and Hackerrank.
    </p>
    <p>
      My goal is to build efficient and scalable backend systems, continuously grow my skills, and contribute to open-source and lightweight software projects.
    </p>
  </div>
    </>
  )
}

export default About