import { motion } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";
import { useState } from "react";
import dogPhoto from "@assets/IMG_5385_1767124821581.PNG";
import runningPhoto from "@assets/IMG_6420_1767124821582.JPG";
import guitarPhoto from "@assets/Yuito_an_Cole_1767124821582.png";

export default function About() {
  const [visibleCaption, setVisibleCaption] = useState<number | null>(null);
  return (
    <div className="pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8">About Cole</h1>
        </motion.div>

        <div className="grid gap-12">
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
                <div className="h-56 w-full overflow-hidden">
                  <img
                    src={dogPhoto}
                    alt="Cole with dog"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 hidden sm:flex sm:group-hover:flex items-end justify-start rounded-lg"
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <p className="relative text-white text-sm leading-tight p-4 font-medium">Raised in San Diego, I love surfing Beacons and hanging with this ferocious bear, Koda</p>
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
                <div className="h-56 w-full overflow-hidden">
                  <img
                    src={runningPhoto}
                    alt="Cole running"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 hidden sm:flex sm:group-hover:flex items-end justify-start rounded-lg"
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <p className="relative text-white text-sm leading-tight p-4 font-medium">I run at grandpa pace but love anything that has me moving</p>
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
                <div className="h-56 w-full overflow-hidden">
                  <img
                    src={guitarPhoto}
                    alt="Cole playing guitar"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 hidden sm:flex sm:group-hover:flex items-end justify-start rounded-lg"
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <p className="relative text-white text-sm leading-tight p-4 font-medium">Click this to watch a video the Nate family made that makes me smile and ugly cry</p>
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
              <h2 className="text-2xl font-display font-bold">Some of my "why's"</h2>
            </div>
            <div className="space-y-6 text-sm text-muted-foreground leading-[1.65]">
              <p>
                During college, I lost my ability to read and write for several months due to a rare form of epilepsy, with an initial prognosis that it might be permanent. That period clarified something important for me: meaning is not derived from mere skill or a singular identity but from the ability to have a real, <a href="#loving-impact" className="text-accent hover:underline">loving impact</a>. When my reading ability returned after finding a medication with unusually high efficacy for me, it became equally clear that thoughtful communication and consideration of complex problems are the ways I can do the most good.
              </p>
              <p>Alongside my work as a consultant at Boston Consulting Group (BCG), I spend a lot of time thinking about how we shape our technology and how our tech shapes us. In 2022, as optimism and concerns around AI became more relevant than ever, I helped re-found the AI Robotics Ethics Society (AIRES) at UCLA. </p>
              <p>I am a generalist, an engineer's business guy, a first principles and systems thinker, and drawn to work that rewards initiative, a dose of EQ, and intellectual curiosity.</p>
            </div>
          </motion.section>

          {/* A Loving Impact */}
          <motion.section
            id="loving-impact"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-secondary/40 p-8 rounded-2xl border border-secondary"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent text-2xl">✦</span> A Loving Impact
            </h3>
            <p className="text-muted-foreground mb-4">
              I'll be the first to admit this is hard to operationalize. But across every health obstacle, professional decision, and personal reset, my sense of meaning keeps resolving to the same place.
            </p>
            <p className="text-muted-foreground">
              If I can help a few people say "I love" a little more often, I'll consider my life well spent. That might mean helping others love the spaces we inhabit, the communities we build, the technologies we choose to bring into the world, or ourselves.
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
