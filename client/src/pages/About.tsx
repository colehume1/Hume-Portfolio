import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Heart, Music, Home as HomeIcon } from "lucide-react";

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
            I'm a believer in the power of connection and unconventional paths. 
            My journey bridges top-tier strategy consulting with creative entrepreneurship.
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
                Currently, I serve as an <strong>Associate at Boston Consulting Group (BCG)</strong> in San Diego. 
                My work involves tackling high-stakes strategic challenges, rigorous analysis, and helping organizations navigation complex transformations.
              </p>
              <p>
                I graduated from <strong>UCLA</strong>, where I was deeply involved in the Bruin Consulting community. 
                That experience didn't just teach me frameworks; it taught me the value of mentorship and rigorous thinking.
              </p>
            </div>
          </motion.section>

          {/* The "Mini Retirement" */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-secondary/40 p-8 rounded-2xl border border-secondary"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-accent text-2xl">✦</span> A Pivot at 22
            </h3>
            <p className="text-muted-foreground mb-4">
              Before jumping straight into the corporate world, I took a "mini retirement" at age 22. 
              It wasn't about escaping work; it was about intentionally exploring creative pursuits, 
              music, and self-discovery before the 9-to-5 began.
            </p>
            <p className="text-muted-foreground italic">
              This period shaped my philosophy: Ambition doesn't have to come at the cost of your soul.
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
                <p className="text-sm text-muted-foreground">Creating original music as a form of pure expression.</p>
              </div>
              <div className="bg-background border p-6 rounded-xl shadow-sm">
                <HomeIcon className="w-8 h-8 text-primary mb-4" />
                <h4 className="font-bold mb-2">Real Estate Agent</h4>
                <p className="text-sm text-muted-foreground">Licensed in California. Helping others build wealth through property.</p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
