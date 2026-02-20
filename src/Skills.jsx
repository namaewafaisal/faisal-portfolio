import React from 'react'
import { useState, useEffect } from "react";


function Skills() {
  const [Category, setCategory] = useState(null);
  useEffect(() => {
    if (Category) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup on unmount
    };
  }, [Category]);
  const skills = [
  {
    category: "Frontend Development",
    skills: [
      { tech: "HTML & TailwindCSS", description: "Responsive layouts with HTML5, CSS3, and TailwindCSS." },
      { tech: "JavaScript (ES6+)", description: "Dynamic interactivity and DOM manipulation." },
      { tech: "React.js + Vite", description: "Building interactive UIs with React, hooks, routing, and Axios integration." }
    ]
  },
  {
    category: "Backend Development",
    skills: [
      { tech: "Java", description: "Intermediate knowledge with OOP, multithreading, exception handling, collections, and file handling." },
      { tech: "Spring Boot", description: "Developing REST APIs, CRUD operations, authentication with Spring Security (JWT), and microservices." },
      { tech: "Python", description: "Scripting, data processing with NumPy & Pandas, and web scraping using BeautifulSoup." },
      { tech: "C", description: "Experience with data structures like linked lists, stacks, and queues." }
    ]
  },
  {
    category: "Databases",
    skills: [
      { tech: "MySQL", description: "Relational database design, queries, joins, and CRUD operations." },
      { tech: "MongoDB", description: "NoSQL schema design and integration with Spring Boot." }
    ]
  },
  {
    category: "DevOps & Tools",
    skills: [
      { tech: "Git & GitHub", description: "Version control, branching strategies, and collaborative workflows." },
      { tech: "Linux", description: "Proficient with CLI tools, customization, and system setup." },
      { tech: "Vite", description: "Frontend build tool for React projects." }
    ]
  },
  {
    category: "Other Technical Skills",
    skills: [
      { tech: "Assembly", description: "Learning low-level programming concepts." },
      { tech: "Microservices", description: "Understanding modular backend design and architecture." }
    ]
  },
  {
    category: "Soft Skills",
    skills: [
      { tech: "Problem Solving", description: "Strong analytical skills, experienced in DSA and real-world problem solving." },
      { tech: "Communication", description: "Clear written and verbal communication; improving public speaking." },
      { tech: "Teamwork", description: "Collaboration in projects using agile practices and version control." },
      { tech: "Continuous Learning", description: "Quickly adapting to new technologies and development environments." }
    ]
  },
  {
    category: "BlockChain",
    skills: [
      {tech: "Solidity", description: "Create Smart contracts for web3 backend" },
    ]
  },
];

  return (
    <> 
    <div id="skills" className="min-h-screen flex flex-col justify-center items-center px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Skills</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 max-w-4xl  gap-8 mt-10">
        {skills.map(category => (
          <div
            key={category.category}
            className="flex flex-col relative mb-8 min-w-auto border-r-2 border-b-2 p-6 bg-zinc-950 rounded-lg shadow transition-transform duration-200 hover:border-r-0 hover:border-b-0 hover:border-l-2 hover:border-t-2"
          >
            <h3 className="text-xl font-semibold mb-4 ">{category.category}</h3>
            <ul className="list-disc list-inside">
              {category.skills.map(skill => (
                <li
                  key={skill.tech}
                >
                  <strong>{skill.tech}</strong>
                </li>
              ))}
            </ul>
             <button className="mt-auto self-end border-l-2 border-b-2 border-white/35 p-1 px-2 rounded-2xl text-white hover:underline transition-transform duration-100 hover:scale-115 cursor-pointer"
              onClick={() => setCategory({ category: category.category, skills: [...category.skills] })}>
              More
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {Category && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 "
        onClick={() => setCategory(null)}>
          <div className="bg-neutral-900 text-white p-8 rounded-2xl shadow-lg max-w-lg w-full relative border-l-2 border-b-2 border-white/70"
          onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              onClick={() => setCategory(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2 text-center">{Category.category}</h2>
            {Category.skills.map((skill) => (
              <div key={skill.tech}>
                <h3 className="text-xl font-semibold mb-1">{skill.tech}</h3>
                <p className="pl-4 text-base mb-2">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
export default Skills