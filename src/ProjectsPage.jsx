const projects = [
  {
    title: 'Alarm Clock Application',
    description: 'Console-based app that lets users add alarms with efficient OS scheduler.',
    tech: 'Java, Swing (in progress)',
    link: 'https://github.com/namaewafaisal/Java_Alarm_App', // Replace with GitHub/demo link as available
  },
  {
    title: 'Linux Customization & Workflow Setup',
    description: 'Configured Arch with Hyprland window manager for daily productivity.',
    tech: 'Linux, Hyprland',
    link: 'https://github.com/namaewafaisal/dotfiles',
  },
  {
    title: 'Course Platform Backend',
    description: 'Course App with role based access',
    tech : 'Spring Boot + MongoDB + JWT Security.',
    link : 'https://github.com/namaewafaisal/CoursePlatformBackend'
  },
  {
    title: 'Web Scraping App',
    description: 'Python + BeautifulSoup for data extraction.',
    tech: 'Python, BeautifulSoup',
    link: 'https://github.com/namaewafaisal/WebScrapingApp',
  },
  {
    title: 'Data Science App',
    description: 'Python + NumPy + Pandas (planned).',
    tech: 'Python, NumPy, Pandas',
    link: 'https://github.com/namaewafaisal/DataScienceApp',
  }
];

// Added id="projects" to make this section targetable for scrolling
const ProjectsPage = () => (
  <>
  <div id="projects" className="max-w-4xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6">Projects</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
      {projects.map(({ title, description, tech, link }) => (
        <div key={title} className="flex flex-col border-r-2 border-b-2 p-6 bg-zinc-950 rounded-lg shadow transition-transform duration-200 hover:border-r-0 hover:border-b-0 hover:border-l-2 hover:border-t-2">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="mb-2">{description}</p>
          <p className="text-sm font-mono mb-3">Tech: {tech}</p>
          {link !== '#' && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="mt-auto self-end border-l-2 border-b-2 border-white/35 p-1 px-2 rounded-2xl text-white hover:underline transition-transform duration-100 hover:scale-115 cursor-pointer">
              View Project
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
  
</>
);

export default ProjectsPage;
