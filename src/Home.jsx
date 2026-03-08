/**
 * Home — Hero Section
 * Shows name, title, social links, and resume buttons.
 * Fetches GitHub profile avatar from the backend.
 */
import React from "react";
import { FaGithub, FaLinkedin, FaDownload, FaFileAlt } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { useFetch } from "./hooks/useFetch";
import { config } from "../portfolio.config.js";

const socialLinks = [
  {
    href: `https://github.com/${config.github}`,
    icon: <FaGithub size={22} />,
    label: "GitHub",
    color: "hover:text-white",
  },
  {
    href: config.linkedin,
    icon: <FaLinkedin size={22} />,
    label: "LinkedIn",
    color: "hover:text-blue-400",
  },
  {
    href: `https://leetcode.com/u/${config.leetcode}/`,
    icon: <SiLeetcode size={22} />,
    label: "LeetCode",
    color: "hover:text-yellow-400",
  },
];

export default function Home() {
  const { data: profile } = useFetch("/api/github/profile");

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.BASE_URL}/Mohamed-Faisal-Resume.pdf`;
    link.download = "Mohamed-Faisal-Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="home" className="min-h-screen flex flex-col justify-center items-center text-white px-6 relative overflow-hidden">

      {/* Background subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-2xl w-full">
        {/* Avatar */}
        {profile?.avatarUrl && (
          <div className="mb-6 flex justify-center">
            <img
              src={profile.avatarUrl}
              alt={config.name}
              className="w-24 h-24 rounded-full border-2 border-white/20 shadow-lg shadow-blue-500/20"
            />
          </div>
        )}

        {/* Name */}
        <h1 className="text-5xl sm:text-6xl font-bold mb-3 tracking-tight">
          Hi, I'm{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {config.name}
          </span>
        </h1>

        {/* Title */}
        <p className="text-gray-400 text-lg sm:text-xl font-mono mb-6 tracking-wide">
          {config.title}
        </p>

        {/* Bio */}
        <p className="text-gray-400 text-base max-w-lg mx-auto mb-8 leading-relaxed">
          {config.bio}
        </p>

        {/* Social links */}
        <div className="flex justify-center gap-5 mb-10">
          {socialLinks.map(({ href, icon, label, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className={`text-gray-500 ${color} transition-all duration-200 hover:scale-110`}
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`${import.meta.env.BASE_URL}/Mohamed-Faisal-Resume.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 justify-center border border-white/20 text-white
                       font-semibold py-2.5 px-6 rounded-full
                       hover:border-white/50 hover:bg-white/5
                       transition-all duration-200"
          >
            <FaFileAlt size={14} />
            View Resume
          </a>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 justify-center bg-white text-black font-semibold
                       py-2.5 px-6 rounded-full hover:bg-gray-100
                       transition-all duration-200 hover:scale-105"
          >
            <FaDownload size={14} />
            Download Resume
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
            <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}