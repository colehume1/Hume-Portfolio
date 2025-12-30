import { motion } from "framer-motion";
import { Mic, Newspaper, ExternalLink, ArrowRight } from "lucide-react";

export default function Content() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-accent font-medium tracking-wide uppercase text-sm mb-4 block">The Media Platform</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Young, Smart, & Battling Broke</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A community for young people navigating financial uncertainty while building meaningful careers.
            We explore entrepreneurship, mindfulness, and unconventional paths to wealth.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Podcast Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <Mic className="w-12 h-12 mb-6 text-accent" />
            <h2 className="text-3xl font-display font-bold mb-4">The Podcast</h2>
            <p className="text-primary-foreground/80 mb-8 leading-relaxed">
              Deep dive interviews with CEOs, founders, and young professionals building 7-figure businesses. 
              We deconstruct their playbooks and mindset.
            </p>

            <div className="space-y-4">
              {[
                { name: "Apple Podcasts", url: "https://podcasts.apple.com/ca/podcast/young-smart-battling-broke/id1782582039" },
                { name: "Spotify", url: "https://open.spotify.com/show/1A1qgRoVWPYYlm0qJB5NHI" },
                { name: "Amazon Music", url: "https://music.amazon.com/podcasts/young-smart-battling-broke" }
              ].map((platform) => (
                <a 
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors group"
                >
                  <span className="font-medium">{platform.name}</span>
                  <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="bg-secondary rounded-3xl p-8 md:p-12 flex flex-col justify-between border border-secondary-foreground/5"
          >
            <div>
              <Newspaper className="w-12 h-12 mb-6 text-primary" />
              <h2 className="text-3xl font-display font-bold mb-4">The Newsletter</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Weekly insights on money, career strategy, and life design. 
                Join hundreds of readers who are redefining what it means to be "rich" in your 20s.
              </p>
              
              <div className="bg-background rounded-xl p-6 shadow-sm border border-border mb-8">
                <h3 className="font-bold mb-2">Recent Topics:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent mt-1">•</span>
                    How to take a "mini retirement" without ruining your career
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent mt-1">•</span>
                    The math behind 7-figure creative businesses
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent mt-1">•</span>
                    Networking for introverts in consulting
                  </li>
                </ul>
              </div>
            </div>

            <a 
              href="https://colehume1.substack.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              Read on Substack <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
