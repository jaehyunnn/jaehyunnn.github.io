"use client";

import { motion } from "framer-motion";
import { Github, Mail, Linkedin } from "lucide-react";
import { useLang } from "./LangContext";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: Linkedin,
  },
  {
    label: "Email",
    href: "mailto:hello@example.com",
    icon: Mail,
  },
];

const TEXT = {
  ko: "궁금한 점이 있으시면 편하게 연락해주세요.",
  en: "Feel free to reach out if you have any questions.",
};

export default function Contact() {
  const { lang } = useLang();

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="content-width text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <span className="gradient-text">Contact</span>
          </h2>
          <div className="section-divider mx-auto mt-4 max-w-xs" />
          <p className="mt-6 text-text-secondary">
            {TEXT[lang]}
          </p>
          <div className="mt-10 flex items-center justify-center gap-5">
            {SOCIAL_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  link.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="social-icon flex h-12 w-12 items-center justify-center text-text-secondary"
                aria-label={link.label}
              >
                <link.icon size={20} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
