import { Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="content-width flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-text-secondary">
          &copy; {new Date().getFullYear()}{" "}
          <span className="gradient-text font-medium">Jae-Hyun Park</span>
          . All rights reserved.
        </p>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon flex h-9 w-9 items-center justify-center text-text-secondary"
            aria-label="GitHub"
          >
            <Github size={16} />
          </a>
          <a
            href="mailto:hello@example.com"
            className="social-icon flex h-9 w-9 items-center justify-center text-text-secondary"
            aria-label="Email"
          >
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
