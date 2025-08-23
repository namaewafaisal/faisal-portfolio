import React from 'react'
import { FaGithub } from 'react-icons/fa';
import { SiGmail, SiLeetcode, SiLinkedin, SiHackerrank, SiFacebook } from 'react-icons/si';

function Contact() {
  return (
    // Added id="contact" to make this section targetable for scrolling
    <>
    <div id="contact" className="min-h-10 flex gap-4 justify-center p-6">
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
    <a
      href="https://www.hackerrank.com/mhd_faisal_46"
      aria-label="Hackerrank"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white transition-transform duration-200 hover:scale-125"
    >
      <SiHackerrank size={32} />
    </a>
    <a
      href="https://www.facebook.com/profile.php?id=100056840665412"
      aria-label="Facebook"
      target="_blank"
      rel="noopener noreferrer"
      className="text-white transition-transform duration-200 hover:scale-125"
    >
      <SiFacebook size={32} />
    </a>
  </div>
  {/* <div id="contact" className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-6 py-16">
  <h2 className="text-4xl font-bold mb-6">Contact Me</h2>
  <p className="mb-6 text-center">Feel free to reach out for collaboration or opportunities!</p>
  <form className="w-full max-w-md space-y-4">
    <input type="text" placeholder="Your Name" className="w-full px-4 py-2 rounded bg-gray-800 text-white" />
    <input type="email" placeholder="Your Email" className="w-full px-4 py-2 rounded bg-gray-800 text-white" />
    <textarea placeholder="Your Message" className="w-full px-4 py-2 rounded bg-gray-800 text-white h-32"></textarea>
    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded font-semibold">
      Send Message
    </button>
  </form>
</div> */}
  </>
);
  
}

export default Contact