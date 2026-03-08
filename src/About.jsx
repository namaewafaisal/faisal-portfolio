/**
 * About — About me section using portfolio.config.js data
 */
import React from "react";
import { SectionTitle } from "./components/ui";
import { config } from "../portfolio.config.js";

export default function About() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-20">
      <SectionTitle>About Me</SectionTitle>
      <div className="max-w-3xl">
        <p className="text-gray-300 text-base leading-relaxed mb-4">
          I'm{" "}
          <span className="text-white font-semibold">{config.name}</span>, a
          dedicated Java backend developer currently pursuing my B.E. in Computer
          Science and Engineering from SRM TRP Engineering College.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-4">
          I'm passionate about Linux customization and sharpening my
          problem-solving skills on platforms like LeetCode. I enjoy working with
          Java, Spring Boot, and building REST APIs with clean architecture.
        </p>
        <p className="text-gray-400 text-base leading-relaxed">
          My goal is to build efficient and scalable backend systems, continuously
          grow my skills, and contribute to open-source and lightweight software
          projects.
        </p>

        {/* Quick facts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
          {[
            { label: "Location", value: config.location },
            { label: "Focus", value: "Backend / Java" },
            { label: "Email", value: config.email },
          ].map(({ label, value }) => (
            <div key={label} className="p-4 rounded-lg border border-white/8 bg-white/2">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-sm text-gray-200 font-medium truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}