/**
 * App.jsx — Root component
 * Assembles all sections. New sections: GitHub, LeetCode, Activity Dashboard.
 */
import React from "react";
import Navbar from "./Navbar";
import Home from "./Home";
import About from "./About";
import Skills from "./Skills";
import GitHubSection from "./components/GitHubSection";
import LeetCodeSection from "./components/LeetCodeSection";
import ActivityDashboard from "./components/ActivityDashboard";
import ProjectsPage from "./ProjectsPage";
import Contact from "./Contact";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Home />
        <About />
        <Skills />
        <ProjectsPage />
        <GitHubSection />
        <LeetCodeSection />
        <ActivityDashboard />
        <Contact />
      </main>
    </>
  );
}

export default App;
