"use client";

import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import Image from "next/image";
import type { NotionProject } from "@/types/notion";

interface ProjectCardProps {
  project: NotionProject;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass-card gradient-border group overflow-hidden hover:glass-card-hover"
    >
      {project.thumbnail && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-text-primary">
          {project.name}
        </h3>
        <p className="mt-2 text-sm text-text-secondary line-clamp-2">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 text-xs font-medium text-accent"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary transition-colors hover:text-accent"
              aria-label={`${project.name} GitHub`}
            >
              <Github size={18} />
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary transition-colors hover:text-accent"
              aria-label={`${project.name} Demo`}
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
