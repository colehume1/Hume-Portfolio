import { Linkedin, Mail, Music, Podcast } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h3 className="font-display text-2xl font-bold mb-2">Cole Hume</h3>
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

      {/* Newsletter Signup */}
      <div className="max-w-7xl mx-auto px-6 mt-4">
        <div className="w-full max-w-[420px] mx-auto md:mx-0">
          <h4 className="text-sm font-semibold mb-2">Newsletter</h4>
          {/* TODO: Paste your Substack embed code here to replace the fallback */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-10 flex-1 rounded-[10px] px-3 bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm focus:outline-none focus:border-white/40"
              data-testid="input-newsletter-email"
            />
            <a
              href="https://substack.com/@colehume?utm_source=website_footer"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-3.5 rounded-[10px] bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium flex items-center justify-center"
              data-testid="button-newsletter-subscribe"
            >
              Subscribe on Substack
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center md:text-left text-sm text-primary-foreground/40">
        © {new Date().getFullYear()} Cole Hume. All rights reserved.
      </div>
    </footer>
  );
}
