import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Heart, Music, Home as HomeIcon } from "lucide-react";
import dogPhoto from "@assets/IMG_5385_1767124821581.PNG";
import runningPhoto from "@assets/IMG_6420_1767124821582.JPG";
import guitarPhoto from "@assets/Yuito_an_Cole_1767124821582.png";

export default function About() {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8">About Cole</h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-12">
            I'm fascinated by the intersection of business strategy, emerging technologies, and the deeper questions about meaning and impact. 
            Through consulting, content creation, and community building, I'm exploring how we can build smarter, more intentional futures.
          </p>
        </motion.div>

        <div className="grid gap-12">
          {/* Professional Journey */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-display font-bold">The Professional Path</h2>
            </div>
            <div className="prose prose-lg text-muted-foreground">
              <p>
                During college, I lost my ability to read for several months due to a rare form of epilepsy, with an initial prognosis that it might be permanent. That period clarified something important for me: meaning is not derived from mere skill or labor, but from the ability to have a real, loving impact. When my reading ability returned after finding a medication with unusually high efficacy for me, it became equally clear that thoughtful communication and careful thinking around complex problems are the ways I can do the most good.
              </p>
              <p>
                Alongside my work as a consultant at Boston Consulting Group (BCG), I spend a lot of time thinking about how technology shapes human decision-making and how responsibility fits as systems become more powerful. In 2022, as concerns around AI safety and misuse grew more urgent, I helped re-found the AI Robotics Ethics Society (AIRES) at UCLA. The organization sat at the intersection of philosophy and computer science and reflected a long-standing interest in building ambitious systems without being careless about their consequences.
              </p>
              <p>
                My thinking is shaped by work that crosses disciplines rather than staying neatly inside them. Books like Gödel, Escher, Bach influenced how I see computation not just as a technical tool, but as a way of understanding structure, meaning, and limits. That perspective continues to guide how I approach problems that sit between logic, creativity, and human judgment.
              </p>
              <p>
                In 2024, I co-founded a home health and wellness inspection company, working closely with customers and service design. We ultimately paused the venture after running into technical constraints that made it difficult to deliver the level of rigor we felt was necessary. While the company did not continue, the experience reinforced my interest in building things carefully and my appetite for early-stage, ambiguous work has not gone away.
              </p>
              <p>
                Across these experiences, I am most drawn to work that rewards clarity of thought, intellectual honesty, and long-term responsibility, especially where technology, business, and human values intersect.
              </p>
            </div>
          </motion.section>

          {/* A Loving Impact */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-secondary/40 p-8 rounded-2xl border border-secondary"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent text-2xl">✦</span> A Loving Impact
            </h3>
            <p className="text-muted-foreground mb-4">
              I'll be the first to admit this is hard to operationalize. You can't spreadsheet "love" and it doesn't map cleanly to outcomes or titles. But across every health scare, career decision, and personal reset, my sense of meaning keeps resolving to the same place.
            </p>
            <p className="text-muted-foreground">
              If I can help a few people say "I love" a little more often, I'll consider my life well spent. That might mean loving the spaces we inhabit, the communities we build, or the technologies and systems we choose to bring into the world.
            </p>
          </motion.section>

          {/* Multifaceted Interests */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-display font-bold">Beyond the Resume</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-background border p-6 rounded-xl shadow-sm">
                <Music className="w-8 h-8 text-accent mb-4" />
                <h4 className="font-bold mb-2">Musician</h4>
                <p className="text-sm text-muted-foreground">Creating original music. I began with a love for poetry and rap, picked up piano as a kid but became obsessed with guitar and banjo in early teenage years. I've been training my voice over the past 2 years and enjoy small performances of original songs. Influenced most by Gregory Alan Isakov, I'm working toward releasing my first music on streaming platforms in 2026.</p>
              </div>
              <div className="bg-background border p-6 rounded-xl shadow-sm">
                <HomeIcon className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-bold mb-2">Real Estate Agent</h4>
                <p className="text-sm text-muted-foreground">Licensed in California primarily for personal investing. While I'm not currently representing clients, I'm well connected to excellent brokers in the San Diego area and happy to make thoughtful referrals. I'm also always glad to talk shop on real estate investing—ADUs, rental cash flow, house hacking, and related decisions.</p>
              </div>
            </div>
          </motion.section>

          {/* Photo Collage */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-lg shadow-sm"
              >
                <img
                  src={dogPhoto}
                  alt="Cole with dog"
                  className="w-full h-64 object-cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-lg shadow-sm"
              >
                <img
                  src={runningPhoto}
                  alt="Cole running"
                  className="w-full h-64 object-cover"
                />
              </motion.div>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-lg shadow-sm"
              >
                <img
                  src={guitarPhoto}
                  alt="Cole playing guitar"
                  className="w-full h-64 object-cover"
                />
              </motion.div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
