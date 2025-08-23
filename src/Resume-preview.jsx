function ResumePreview() {
  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-900 font-semibold">
      {/* Download Button */}
      <div className="flex justify-end mb-6">
        <a
          href="/Mohamed-Faisal-Resume.pdf"
          download="Mohamed-Faisal-Resume.pdf"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          aria-label="Download Resume PDF"
        >
          Download Resume PDF
        </a>
      </div>

      {/* Resume Content */}
      <div className="whitespace-pre-wrap leading-relaxed text-sm">
        {`
Mohamed Faisal
Java Developer and Linux Enthusiast

Ponnagar, Tiruchirapallii-1
8344869090
mohamed.faisal.4626@gmail.com
Linkedin: mohamed-faisal-811418351
Github: https://github.com/namaewafaisal

EDUCATION
SRM TRP Engineering college, Trichy — B.E
September 2023 - 2027
Pursuing B.E computer Science and Engineering

OBJECTIVES

Focused Java Backend Developer

Dedicated to mastering backend development using Java. Currently building
strong skills in developing scalable applications, backend APIs, and
system-level programming.

Linux and Problem-solving

Passionate about Linux customization, system management, continuously
improving problem-solving abilities by practising challenges in platforms
like Leetcode and Hackerrank.

PROJECTS
Alarm Clock Application (In Progress)

Developed a console based alarm clock app that lets the user add alarms to
ring at specific times. It uses a scheduler to let the OS handle the alarm,
removing the need to run the thread in the background all the time.

Currently learning swing for creating GUI for the app.

Linux Customization and Workflow Setup
Setup and customized EndeavorOS with Hyprland as a daily Linux
environment. Configured workspace management, window tiling, and
personalized it with multiple light weight software put together.

SKILLS
Communication skills (Improving)
Java programming
App development
Linux

INTERESTS
Building efficient, scalable backend systems using Java
and related technologies

Practising problem solving to improve knowledge in DSA and
to improve critical thinking.

Exploring and contributing to light-weight and open-source
applications and softwares.

Learning Linux commands and fixing break in Linux systems

Actively learning Japanese language and exploring its
culture

LANGUAGES
Tamil, English,
Japanese (Beginner)
        `}
      </div>
    </section>
  );
}
export default ResumePreview