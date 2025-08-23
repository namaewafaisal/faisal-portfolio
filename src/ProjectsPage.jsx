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
];

// Added id="projects" to make this section targetable for scrolling
const ProjectsPage = () => (
  <div id="projects" className="max-w-4xl mx-auto p-6">
    <h2 className="text-3xl font-bold mb-6">Projects</h2>
    <div className="grid gap-6">
      {projects.map(({ title, description, tech, link }) => (
        <div key={title} className="border rounded p-4 shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="mb-2">{description}</p>
          <p className="text-sm font-mono mb-3">Tech: {tech}</p>
          {link !== '#' && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              View Project
            </a>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default ProjectsPage;
