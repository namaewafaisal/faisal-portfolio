import React from 'react';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import ProjectsPage from './ProjectsPage';
import Contact from './Contact';

function App() {
  return (
    <>
      {/* The Navbar is fixed and will stay at the top while scrolling */}
      <Navbar />

      {/* The main container for all the page sections */}
      <main>
        <Home />
        <About />
        <ProjectsPage />
        <Contact />
      </main>
    </>
  );
}

export default App;
