import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Projects from "@/components/home/Projects";
import Contact from "@/components/home/Contact";
import { getFeaturedProjects, getAbout } from "@/lib/notion";
import { getBio } from "@/lib/bio";

export default function Home() {
  const projects = getFeaturedProjects();
  const about = getAbout();
  const bio = getBio();

  return (
    <>
      <Hero />
      <About about={about} bioHtml={bio} />
      <Projects projects={projects} />
      <Contact />
    </>
  );
}
