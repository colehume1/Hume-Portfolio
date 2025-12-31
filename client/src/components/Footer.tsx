import { Linkedin, Mail, Music, Podcast } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h3 className="font-display text-2xl font-bold mb-2">Cole Hume</h3>
          <p className="text-primary-foreground/70 max-w-xs">
            I hope to have a loving impact through building businesses,<br />
            sharing what I learn, and investing in community.
          </p>
        </div>

        <div className="flex gap-6">
          <a 
            href="https://www.linkedin.com/in/cole-hume-a737041b6" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a 
            href="mailto:colehume1@gmail.com"
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a 
            href="https://colehume1.substack.com"
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Substack"
          >
            <Podcast className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center md:text-left text-sm text-primary-foreground/40">
        © {new Date().getFullYear()} Cole Hume. All rights reserved.
      </div>
    </footer>
  );
}
