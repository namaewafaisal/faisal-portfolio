import React from 'react'

function Skills() {
  return (
    <div id="skills" className="min-h-screen flex flex-col justify-center items-center px-6 py-16">
      <h2 className="text-4xl font-bold mb-6">Skills</h2>
      <p className="max-w-2xl text-center text-lg">
        Here are some of my technical skills:
      </p>
      <ul className="list-disc list-inside">
        <li>Java</li>
        <li>Spring Boot</li>
        <li>RESTful APIs</li>
        <li>Microservices</li>
        <li>Linux</li>
      </ul>
    </div>
  )
}

export default Skills