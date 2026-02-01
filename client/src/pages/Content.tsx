import { motion } from "framer-motion";
import { Mic, Newspaper, ExternalLink, ArrowRight, Youtube, Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SubstackPost {
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
}

interface PostsResponse {
  posts: SubstackPost[];
  error?: string;
}

const POSTS_TO_SHOW = 8;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export default function Content() {
  const { data, isLoading, error } = useQuery<PostsResponse>({
    queryKey: ['/api/posts'],
  });

  const posts = data?.posts?.slice(0, POSTS_TO_SHOW) || [];

  return (
    <div className="pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Navigating the Chaotic, Wonderful 20s</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Young, Smart, & Battling Broke is a media platform for ambitious young people solving the work thing, the money thing, and the meaning thing. Exploring with honesty, curiosity, and long-term thinking.
          </p>
        </motion.div>

        {/* Content Hub Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="text-center text-muted-foreground mb-12">
            Find my conversations and ideas across writing, video, and audio.
          </p>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {/* YouTube Card */}
            <motion.a
              href="https://www.youtube.com/@COLEHUME/videos"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="group bg-background border rounded-xl p-8 text-center hover:border-primary/50 transition-colors"
            >
              <Youtube className="w-10 h-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-2">Video Essays & Conversations</h3>
              <p className="text-sm text-muted-foreground">Long-form explorations on YouTube</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Watch <ExternalLink className="w-3 h-3" />
              </div>
            </motion.a>

            {/* Writing Card */}
            <motion.a
              href="https://colehume1.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="group bg-background border rounded-xl p-8 text-center hover:border-primary/50 transition-colors"
            >
              <Newspaper className="w-10 h-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-2">Writing & Newsletter</h3>
              <p className="text-sm text-muted-foreground">Weekly insights on Substack</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Read <ExternalLink className="w-3 h-3" />
              </div>
            </motion.a>

            {/* Podcast Card */}
            <motion.a
              href="https://podcasts.apple.com/ca/podcast/young-smart-battling-broke/id1782582039"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="group bg-background border rounded-xl p-8 text-center hover:border-primary/50 transition-colors"
            >
              <Mic className="w-10 h-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg mb-2">Podcast</h3>
              <p className="text-sm text-muted-foreground">Deep-dive conversations</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Listen <ExternalLink className="w-3 h-3" />
              </div>
            </motion.a>
          </div>
        </motion.section>

        {/* Detailed Platform Sections */}
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
                { name: "Spotify", url: "https://open.spotify.com/show/1A1qgRoVWPYYlm0qJB5NHI" }
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
                    Letter to new grads on job adulthood
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

        {/* Latest Writing Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold">Latest Writing</h2>
            <a 
              href="https://colehume1.substack.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-accent hover:text-primary transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-secondary/50 rounded-xl p-6 text-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Unable to load posts right now. Check back later or visit Substack directly.</p>
              <a 
                href="https://colehume1.substack.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-accent hover:text-primary transition-colors"
              >
                Go to Substack <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <div className="bg-secondary/50 rounded-xl p-6 text-center">
              <p className="text-muted-foreground">No posts available yet.</p>
            </div>
          )}

          {!isLoading && !error && posts.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-6">
              {posts.map((post, index) => (
                <motion.a
                  key={post.link}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group bg-background border rounded-xl p-6 hover:border-primary/50 transition-colors"
                  data-testid={`post-card-${index}`}
                >
                  <span className="text-xs text-muted-foreground">{formatDate(post.pubDate)}</span>
                  <h3 className="font-bold text-lg mt-2 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-4 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Read more <ExternalLink className="w-3 h-3" />
                  </div>
                </motion.a>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
