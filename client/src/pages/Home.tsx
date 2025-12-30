import { motion } from "framer-motion";
import { ArrowRight, Mic, Users, LineChart } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={{
              initial: { opacity: 0 },
              animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            <motion.span variants={fadeIn} className="inline-block text-accent font-medium tracking-wider text-sm uppercase mb-4">
              Based in San Diego
            </motion.span>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-display font-bold text-foreground leading-[1.1] mb-6">
              Cole Hume
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground font-light mb-8 max-w-lg">
              Associate at BCG. Content Creator. <br className="hidden md:block"/>
              Building community with loving impact.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                Get in Touch
              </Link>
              <Link href="/content" className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors group">
                View Content <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl bg-muted relative">
              {/* Using a placeholder for Cole - normally would be his photo */}
              {/* Professional headshot placeholder */}
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" 
                alt="Professional portrait"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl max-w-xs hidden md:block">
              <p className="font-display italic text-lg text-primary">"Connecting young minds to build wealth with creativity and passion."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="bg-secondary/30 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <LineChart className="w-8 h-8 text-primary" />,
                title: "Strategy & Consulting",
                desc: "Solving complex problems as an Associate at Boston Consulting Group (BCG)."
              },
              {
                icon: <Mic className="w-8 h-8 text-accent" />,
                title: "Media & Content",
                desc: "Hosting 'Young, Smart, & Battling Broke'—exploring entrepreneurship and mindset."
              },
              {
                icon: <Users className="w-8 h-8 text-primary" />,
                title: "Community & Impact",
                desc: "Connecting ambitious professionals to foster growth and financial savviness."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow"
              >
                <div className="mb-6 p-3 bg-secondary rounded-xl w-fit">{item.icon}</div>
                <h3 className="text-xl font-bold font-display mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
