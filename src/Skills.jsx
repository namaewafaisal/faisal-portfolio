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
  },
  {
  category: "Soft Skills & Other Competencies",
  skills: [
    { tech: "Problem Solving", description: "Strong analytical and logical thinking skills, experienced in solving algorithmic and real-world problems." },
    { tech: "Communication", description: "Able to convey ideas clearly in both written and verbal forms; improving public speaking skills." },
    { tech: "Teamwork & Collaboration", description: "Experience working in collaborative projects, using version control and agile practices." },
    { tech: "Continuous Learning", description: "Quick to learn new technologies and adapt to evolving development environments." }
  ]
}
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