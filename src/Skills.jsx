import React from 'react'
import { useState, useEffect } from "react";

function Skills() {
  const [openSkill, setOpenSkill] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const toggleSkill = (tech) => {
    setOpenSkill(openSkill === tech ? null : tech);
  };
  useEffect(() => {
    if (selectedSkill) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup on unmount
    };
  }, [selectedSkill]);
  const skills = [
  {
    category: "Programming Languages",
    skills: [
      { tech: "Java", description: "Intermediate knowledge with experience in OOP, multithreading, exception handling, file handling, and collections." },
      { tech: "Python", description: "Basic experience with scripting, NumPy, Pandas, and web scraping using BeautifulSoup." },
      { tech: "C", description: "Hands-on experience with data structures like linked lists, stacks, and queues." },
      { tech: "JavaScript", description: "Knowledge of ES6+, React, and frontend interactivity." },
      { tech: "Assembly", description: "Currently learning low-level programming concepts." }
    ]
  },
  {
    category: "Web Development",
    skills: [
      { tech: "HTML & CSS", description: "Proficient in building responsive layouts with HTML5, CSS3, and TailwindCSS." },
      { tech: "React.js", description: "Experience building interactive UIs with React and Vite." },
      { tech: "RESTful APIs", description: "Skilled in designing and implementing REST APIs using Spring Boot." }
    ]
  },
  {
    category: "Frameworks & Tools",
    skills: [
      { tech: "Spring Boot", description: "Experience developing backend services, CRUD APIs, and authentication with Spring Security + JWT." },
      { tech: "Microservices", description: "Knowledge of microservice architecture and modular backend design." },
      { tech: "Git & GitHub", description: "Familiar with version control, branching, and collaborative development." }
    ]
  },
  {
    category: "Databases",
    skills: [
      { tech: "MySQL", description: "Experience with relational database design, queries, and CRUD operations." },
      { tech: "MongoDB", description: "Hands-on experience with NoSQL databases and integration with Spring Boot." }
    ]
  },
  {
    category: "Systems & Platforms",
    skills: [
      { tech: "Linux", description: "Comfortable with Linux environments, CLI tools, and system setup/customization." },
      { tech: "Vite", description: "Used as a frontend build tool for React projects." }
    ]
  }
];

  return (
    <> 
    <div id="skills" className="min-h-screen flex flex-col justify-center items-center px-6 py-16 relative">
      <h1 className="text-4xl font-bold mb-6">Skills</h1>
      <div className="grid grid-cols-3 gap-8 mt-10">
        {skills.map(category => (
          <div
            key={category.category}
            className="mb-8 border-2 p-5 group cursor-pointer hover:bg-gray-950 rounded-2xl"
          >
            <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
            <ul className="list-disc list-inside">
              {category.skills.map(skill => (
                <li
                  key={skill.tech}
                  onClick={() => setSelectedSkill({ ...skill, category: category.category })}
                  className="cursor-pointer transition-transform duration-100 hover:scale-105"
                >
                  <strong>{skill.tech}</strong>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 ">
          <div className="bg-blend-darken text-white p-8 rounded-2xl shadow-lg max-w-lg w-full relative border-l-2 border-b-2 border-white/40 p-4">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
              onClick={() => setSelectedSkill(null)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedSkill.tech}</h2>
            <p className="text-gray-400 text-sm mb-4">
              Category: {selectedSkill.category}
            </p>
            <p className="text-base">{selectedSkill.description}</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
export default Skills