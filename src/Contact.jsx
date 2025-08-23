import React from 'react'
import { FaGithub } from 'react-icons/fa';
import { SiGmail, SiLeetcode, SiLinkedin } from 'react-icons/si';

function Contact() {
  return (
    // Added id="contact" to make this section targetable for scrolling
    <div id="contact" className="flex gap-4 justify-center p-6">
    <a
      href="https://github.com/namaewafaisal"
      aria-label="GitHub"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white transition-transform duration-100 hover:scale-125"
    >
      <FaGithub size={32} />
    </a>
    <a
      href="mailto:mohamed.faisal.4626@gmail.com"
      aria-label="Gmail"
      className="text-white transition-transform duration-200 hover:scale-125"
    >
      <SiGmail size={32} />
    </a>
    <a
      href="https://leetcode.com/u/mhd-faisal-46/"
      aria-label="LeetCode"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white transition-transform duration-200 hover:scale-125"
    >
      <SiLeetcode size={32} />
    </a>
    <a
      href="https://www.linkedin.com/in/mohamed-faisal-811418351/"
      aria-label="LinkedIn"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white transition-transform duration-200 hover:scale-125"
    >
      <SiLinkedin size={32} />
    </a>
  </div>
);
  
}

export default Contact