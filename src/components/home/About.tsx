"use client";

import { motion } from "framer-motion";
import { useLang } from "./LangContext";
import type { NotionAbout } from "@/types/notion";

interface AboutProps {
  about: NotionAbout | null;
  bioHtml?: { ko: string; en: string } | null;
}

const fallbackKo = `
<p>안녕하세요! AI Research Engineer & PM, 박재현입니다.</p>
<p>기술을 통해 더 나은 사용자 경험을 만들어가고 있습니다.</p>
`;

const fallbackEn = `
<p>Hi! I'm Jae-Hyun Park, an AI Research Engineer & PM.</p>
<p>I'm dedicated to creating better user experiences through technology.</p>
`;

export default function About({ about, bioHtml }: AboutProps) {
  const { lang } = useLang();

  const koHtml = about?.contentHtml ?? bioHtml?.ko ?? fallbackKo;
  const enHtml = about?.contentHtmlEn ?? bioHtml?.en ?? fallbackEn;
  const currentHtml = lang === "ko" ? koHtml : enHtml;

  return (
    <section id="bio" className="py-24 sm:py-32">
      <div className="content-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            <span className="gradient-text">Bio</span>
          </h2>

          <div className="section-divider mt-4" />

          <div
            key={lang}
            className="prose-custom mt-8"
            dangerouslySetInnerHTML={{ __html: currentHtml }}
          />
        </motion.div>
      </div>
    </section>
  );
}
