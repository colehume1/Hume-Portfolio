import { motion } from "framer-motion";
import { Mic, Newspaper, ExternalLink, ArrowRight, Youtube, Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SubstackPost {
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
  image: string | null;
}

interface PostsResponse {
  posts: SubstackPost[];
  error?: string;
}

const DEFAULT_POSTS_TO_SHOW = 8;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

interface ContentProps {
  maxPosts?: number;
}

export default function Content({ maxPosts }: ContentProps) {
  const postsToShow = maxPosts ?? DEFAULT_POSTS_TO_SHOW;
  
  const { data, isLoading, error } = useQuery<PostsResponse>({
    queryKey: ['/api/posts'],
  });

  const posts = data?.posts?.slice(0, postsToShow) || [];

  return (
    <div className="pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Navigating the Chaotic, Wonderful 20s</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">Young, Smart, & Battling Broke is a media platform for curious and intentional young people figuring out work, money, and meaning</p>
        </motion.div>

        {/* Content Hub Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid sm:grid-cols-3 gap-6">
            {/* YouTube Card */}
            <motion.a
              href="https://www.youtube.com/@COLEHUME/videos"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="group bg-background border rounded-xl p-5 text-center hover:border-primary/50 transition-colors"
            >
              <Youtube className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-base mb-1">Video Essays & Conversations</h3>
              <p className="text-sm text-muted-foreground">Long-form explorations on YouTube</p>
              <div className="flex items-center justify-center gap-2 mt-3 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Watch <ExternalLink className="w-3 h-3" />
              </div>
            </motion.a>

            {/* Writing Card */}
            <motion.a
              href="https://colehume1.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="group bg-background border rounded-xl p-5 text-center hover:border-primary/50 transition-colors"
            >
              <Newspaper className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-base mb-1">Writing & Newsletter</h3>
              <p className="text-sm text-muted-foreground">Weekly insights on Substack</p>
              <div className="flex items-center justify-center gap-2 mt-3 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Read <ExternalLink className="w-3 h-3" />
              </div>
            </motion.a>

            {/* Podcast Card */}
            <motion.a
              href="https://podcasts.apple.com/ca/podcast/young-smart-battling-broke/id1782582039"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              className="group bg-background border rounded-xl p-5 text-center hover:border-primary/50 transition-colors"
            >
              <Mic className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-base mb-1">Podcast</h3>
              <p className="text-sm text-muted-foreground">Deep-dive conversations</p>
              <div className="flex items-center justify-center gap-2 mt-3 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Listen <ExternalLink className="w-3 h-3" />
              </div>
            </motion.a>
          </div>
        </motion.section>

        {/* Latest Writing Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold" data-testid="text-latest-writing-title">Latest conversations, ideas, & deep dives</h2>
            <a 
              href="https://colehume1.substack.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-accent flex items-center gap-1"
              data-testid="link-view-all-posts"
            >
              View all <ArrowRight className="w-3 h-3" />
            </a>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12" data-testid="status-posts-loading">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {error && (
            <div className="bg-secondary/50 rounded-xl p-6 text-center" data-testid="status-posts-error">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground" data-testid="text-posts-error-message">Unable to load posts right now. Check back later or visit Substack directly.</p>
              <a 
                href="https://colehume1.substack.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-accent"
                data-testid="link-substack-fallback"
              >
                Go to Substack <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <div className="bg-secondary/50 rounded-xl p-6 text-center" data-testid="status-posts-empty">
              <p className="text-muted-foreground" data-testid="text-posts-empty-message">No posts available yet.</p>
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
                  className="bg-background border rounded-xl overflow-hidden hover-elevate"
                  data-testid={`link-post-${index}`}
                >
                  {post.image && (
                    <div className="aspect-video w-full overflow-hidden bg-secondary">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                        data-testid={`img-post-${index}`}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-xs text-muted-foreground" data-testid={`text-post-date-${index}`}>{formatDate(post.pubDate)}</span>
                    <h3 className="font-bold text-lg mt-2 mb-3 line-clamp-2" data-testid={`text-post-title-${index}`}>
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-post-excerpt-${index}`}>{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-4 text-accent text-sm font-medium" data-testid={`text-post-readmore-${index}`}>
                      Read more <ExternalLink className="w-3 h-3" />
                    </div>
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
