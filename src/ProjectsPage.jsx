import React from "react";
import { FaCode, FaExternalLinkAlt, FaFolder, FaDatabase, FaTerminal, FaJava, FaPython } from "react-icons/fa";
import { SectionTitle, Badge } from "./components/ui";

const projects = [
  {
    title: 'Alarm Clock Application',
    description: 'A robust console-based application featuring a custom OS-level scheduler for high-precision alarm management.',
    tech: ['Java', 'Swing', 'Multithreading'],
    link: 'https://github.com/namaewafaisal/Java_Alarm_App',
    icon: <FaJava className="text-orange-400" />,
  },
  {
    title: 'Linux Customization & Workflow',
    description: 'Advanced desktop environment setup using Hyprland on Arch Linux, optimized for professional development productivity.',
    tech: ['Linux', 'Hyprland', 'Bash', 'Lua'],
    link: 'https://github.com/namaewafaisal/dotfiles',
    icon: <FaTerminal className="text-green-400" />,
  },
  {
    title: 'Course Platform Backend',
    description: 'Scalable backend architecture for an educational platform with complex role-based access control and secure authentication.',
    tech: ['Spring Boot', 'MongoDB', 'JWT', 'REST'],
    link: 'https://github.com/namaewafaisal/CoursePlatformBackend',
    icon: <FaDatabase className="text-blue-400" />,
  },
  {
    title: 'Automated Web Scraper',
    description: 'Highly efficient data extraction tool designed to parse complex HTML structures and generate structured data reports.',
    tech: ['Python', 'BeautifulSoup', 'Requests'],
    link: 'https://github.com/namaewafaisal/WebScrapingApp',
    icon: <FaPython className="text-yellow-400" />,
  },
  {
    title: 'Data Science Analytics Suite',
    description: 'Analytical toolkit focused on data processing and visualization for large datasets using specialized mathematical libraries.',
    tech: ['Python', 'NumPy', 'Pandas'],
    link: 'https://github.com/namaewafaisal/DataScienceApp',
    icon: <FaCode className="text-purple-400" />,
  }
];

const ProjectsPage = () => (
  <section id="projects" className="max-w-6xl mx-auto px-6 py-20">
    <SectionTitle>Featured Projects</SectionTitle>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(({ title, description, tech, link, icon }) => (
        <div
          key={title}
          className="group relative flex flex-col h-full bg-white/3 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/5 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-blue-500/10 transition-colors">
              {React.cloneElement(icon, { size: 24 })}
            </div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              <FaExternalLinkAlt size={16} />
            </a>
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
            {description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tech.map((item) => (
              <Badge key={item} color="blue">{item}</Badge>
            ))}
          </div>

          {/* Footer Action */}
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            View Repository
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </a>
        </div>
      ))}
    </div>
  </section>
);

export default ProjectsPage;

