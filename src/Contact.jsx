import React from 'react'
import { FaGithub } from 'react-icons/fa';
import { SiGmail, SiLeetcode, SiLinkedin, SiHackerrank, SiFacebook } from 'react-icons/si';

function Contact() {
  const contactLinks = [
    {
      href: "https://github.com/namaewafaisal",
      label: "GitHub",
      icon: <FaGithub size={32} />
    },
    {
      href: "mailto:mohamed.faisal.4626@gmail.com",
      label: "Gmail",
      icon: <SiGmail size={32} />
    },
    {
      href: "https://leetcode.com/u/mhd-faisal-46/",
      label: "LeetCode",
      icon: <SiLeetcode size={32} />
    },
    {
      href: "https://www.linkedin.com/in/mohamed-faisal-811418351/",
      label: "LinkedIn",
      icon: <SiLinkedin size={32} />
    },
    {
      href: "https://www.hackerrank.com/mhd_faisal_46",
      label: "Hackerrank",
      icon: <SiHackerrank size={32} />
    },
    {
      href: "https://www.facebook.com/profile.php?id=100056840665412",
      label: "Facebook",
      icon: <SiFacebook size={32} />
    },
  ]
  return (
    // Added id="contact" to make this section targetable for scrolling
    <>
    <div id="contact" className="min-h-10 flex gap-4 justify-center p-6">
      {contactLinks.map(link => (
        <a
          key={link.label}
          href={link.href}
          aria-label={link.label}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white transition-transform duration-100 hover:scale-125"
          title={link.label}
        >
          {link.icon}
        </a>
      ))}
    </div>
  </>
);
}

export default Contact
      