/**
 * Contact — Social links footer section using portfolio.config.js
 */
import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail, SiLeetcode, SiHackerrank } from "react-icons/si";
import { config } from "../portfolio.config.js";

const contactLinks = [
  {
    href: `https://github.com/${config.github}`,
    label: "GitHub",
    icon: <FaGithub size={28} />,
    color: "hover:text-white",
  },
  {
    href: `mailto:${config.email}`,
    label: "Gmail",
    icon: <SiGmail size={28} />,
    color: "hover:text-red-400",
  },
  {
    href: `https://leetcode.com/u/${config.leetcode}/`,
    label: "LeetCode",
    icon: <SiLeetcode size={28} />,
    color: "hover:text-yellow-400",
  },
  {
    href: config.linkedin,
    label: "LinkedIn",
    icon: <FaLinkedin size={28} />,
    color: "hover:text-blue-400",
  },
  {
    href: `https://www.hackerrank.com/${config.hackerrank}`,
    label: "Hackerrank",
    icon: <SiHackerrank size={28} />,
    color: "hover:text-green-400",
  },
];

export default function Contact() {
  return (
    <footer id="contact" className="py-16 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-6">
        <p className="text-gray-500 text-sm">Get in touch</p>
        <div className="flex gap-6">
          {contactLinks.map(({ href, label, icon, color }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              title={label}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-600 ${color} transition-all duration-200 hover:scale-110`}
            >
              {icon}
            </a>
          ))}
        </div>
        <p className="text-gray-700 text-xs font-mono">
          © {new Date().getFullYear()} {config.name} · Built with React + Vite
        </p>
      </div>
    </footer>
  );
}