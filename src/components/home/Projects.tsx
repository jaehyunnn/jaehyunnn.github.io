"use client";

import { motion } from "framer-motion";
import type { NotionProject } from "@/types/notion";
import ProjectCard from "./ProjectCard";

interface ProjectsProps {
  projects: NotionProject[];
}

export default function Projects({ projects }: ProjectsProps) {
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="content-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <span className="gradient-text">Projects</span>
          </h2>
          <div className="section-divider mt-4" />
        </motion.div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
