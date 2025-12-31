import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Heart, Music, Home as HomeIcon, Users } from "lucide-react";
import { useState } from "react";
import dogPhoto from "@assets/IMG_5385_1767124821581.PNG";
import runningPhoto from "@assets/IMG_6420_1767124821582.JPG";
import guitarPhoto from "@assets/Yuito_an_Cole_1767124821582.png";

export default function About() {
  const [visibleCaption, setVisibleCaption] = useState<number | null>(null);
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8">About Cole</h1>
        </motion.div>

        <div className="grid gap-12">
          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 py-12"
          >
            <div className="flex-1 h-px bg-border"></div>
            <p className="text-sm text-muted-foreground whitespace-nowrap">Other things that make me happy</p>
            <div className="flex-1 h-px bg-border"></div>
          </motion.div>

          {/* Photo Collage */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-0"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Image 1: Dog */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-lg shadow-sm cursor-pointer"
                onClick={() => setVisibleCaption(visibleCaption === 0 ? null : 0)}
              >
                <img
                  src={dogPhoto}
                  alt="Cole with dog"
                  className="w-full h-64 object-cover"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 hidden sm:flex sm:group-hover:flex items-end justify-start rounded-lg"
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <p className="relative text-white text-sm leading-tight p-4 font-medium">
                    Raised in San Diego. I love surfing Beacons Beach and hanging with my family pup, Koda.
                  </p>
                </motion.div>
                {visibleCaption === 0 && (
                  <div className="absolute inset-0 sm:hidden flex items-end justify-start rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <p className="relative text-white text-sm leading-tight p-4 font-medium">
                      Raised in San Diego. I love surfing Beacons Beach and hanging with my family pup, Koda.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Image 2: Running */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-lg shadow-sm cursor-pointer"
                onClick={() => setVisibleCaption(visibleCaption === 1 ? null : 1)}
              >
                <img
                  src={runningPhoto}
                  alt="Cole running"
                  className="w-full h-64 object-cover object-top"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 hidden sm:flex sm:group-hover:flex items-end justify-start rounded-lg"
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <p className="relative text-white text-sm leading-tight p-4 font-medium">
                    Health nerd. Ran my first marathon in 2025.
                  </p>
                </motion.div>
                {visibleCaption === 1 && (
                  <div className="absolute inset-0 sm:hidden flex items-end justify-start rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <p className="relative text-white text-sm leading-tight p-4 font-medium">
                      Health nerd. Ran my first marathon in 2025.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Image 3: Guitar */}
              <motion.a
                href="https://www.linkedin.com/posts/cole-hume-a737041b6_warning-this-post-will-not-align-with-what-activity-7270856848562352129-ia6R?utm_source=share&utm_medium=member_desktop&rcm=ACoAADJLVPcB3nujto_6lcswhw5kOEC--q2B0M8"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-lg shadow-sm cursor-pointer block"
              >
                <img
                  src={guitarPhoto}
                  alt="Cole playing guitar"
                  className="w-full h-64 object-cover"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 hidden sm:flex sm:group-hover:flex items-end justify-start rounded-lg"
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <p className="relative text-white text-sm leading-tight p-4 font-medium">
                    Click this photo to watch a video of my time with the incredibly special Nate family from when I studied in Japan.
                  </p>
                </motion.div>
                <div className="absolute inset-0 sm:hidden flex items-end justify-start rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <p className="relative text-white text-sm leading-tight p-4 font-medium">
                    Click this photo to watch a video of my time with the incredibly special Nate family from when I studied in Japan.
                  </p>
                </div>
              </motion.a>
            </div>
          </motion.section>

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
            <div className="space-y-6 text-sm text-muted-foreground leading-[1.65]">
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
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-background border p-6 rounded-xl shadow-sm">
                <Music className="w-8 h-8 text-accent mb-4" />
                <h4 className="font-bold mb-2">Musician</h4>
                <p className="text-sm text-muted-foreground">I play guitar and write original songs. I've trained my voice over the past couple years and perform with friends. Music is a way I process the world, influenced by artists like Gregory Alan Isakov.</p>
              </div>
              <div className="bg-background border p-6 rounded-xl shadow-sm">
                <HomeIcon className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-bold mb-2">Real Estate Agent</h4>
                <p className="text-sm text-muted-foreground">Licensed in California for personal investing. I'm not actively representing clients, but I enjoy talking about real estate and making introductions when I can help.</p>
              </div>
              <div className="bg-background border p-6 rounded-xl shadow-sm">
                <Users className="w-8 h-8 text-accent mb-4" />
                <h4 className="font-bold mb-2">Volunteer & Organizer</h4>
                <p className="text-sm text-muted-foreground">My brother's diagnosis with Juvenile Dermatomyositis led my family to start the Cure JM Foundation, an experience that shaped my childhood and how I think about what matters.</p>
              </div>
            </div>
          </motion.section>

          {/* Photo Collage */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-0"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Image 1: Dog */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-lg shadow-sm cursor-pointer"
                onClick={() => setVisibleCaption(visibleCaption === 0 ? null : 0)}
              >
                <img
                  src={dogPhoto}
                  alt="Cole with dog"
                  className="w-full h-64 object-cover"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 hidden sm:flex sm:group-hover:flex items-end justify-start rounded-lg"
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <p className="relative text-white text-sm leading-tight p-4 font-medium">
                    Raised in San Diego. I love surfing Beacons Beach and hanging with my family pup, Koda.
                  </p>
                </motion.div>
                {visibleCaption === 0 && (
                  <div className="absolute inset-0 sm:hidden flex items-end justify-start rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <p className="relative text-white text-sm leading-tight p-4 font-medium">
                      Raised in San Diego. I love surfing Beacons Beach and hanging with my family pup, Koda.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Image 2: Running */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-lg shadow-sm cursor-pointer"
                onClick={() => setVisibleCaption(visibleCaption === 1 ? null : 1)}
              >
                <img
                  src={runningPhoto}
                  alt="Cole running"
                  className="w-full h-64 object-cover object-top"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 hidden sm:flex sm:group-hover:flex items-end justify-start rounded-lg"
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <p className="relative text-white text-sm leading-tight p-4 font-medium">
                    Health nerd. Ran my first marathon in 2025.
                  </p>
                </motion.div>
                {visibleCaption === 1 && (
                  <div className="absolute inset-0 sm:hidden flex items-end justify-start rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <p className="relative text-white text-sm leading-tight p-4 font-medium">
                      Health nerd. Ran my first marathon in 2025.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Image 3: Guitar */}
              <motion.a
                href="https://www.linkedin.com/posts/cole-hume-a737041b6_warning-this-post-will-not-align-with-what-activity-7270856848562352129-ia6R?utm_source=share&utm_medium=member_desktop&rcm=ACoAADJLVPcB3nujto_6lcswhw5kOEC--q2B0M8"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-lg shadow-sm cursor-pointer block"
              >
                <img
                  src={guitarPhoto}
                  alt="Cole playing guitar"
                  className="w-full h-64 object-cover"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 hidden sm:flex sm:group-hover:flex items-end justify-start rounded-lg"
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <p className="relative text-white text-sm leading-tight p-4 font-medium">
                    Click this photo to watch a video of my time with the incredibly special Nate family from when I studied in Japan.
                  </p>
                </motion.div>
                <div className="absolute inset-0 sm:hidden flex items-end justify-start rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <p className="relative text-white text-sm leading-tight p-4 font-medium">
                    Click this photo to watch a video of my time with the incredibly special Nate family from when I studied in Japan.
                  </p>
                </div>
              </motion.a>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
