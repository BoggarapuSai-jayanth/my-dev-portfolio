import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

export function About() {
  const { portfolioData } = usePortfolio();
  const aboutData = portfolioData?.about || {};

  // Resolve uploaded images vs external URLs
  const resolveImg = (url) => {
    if (!url) return '';
    return url.startsWith('/uploads') ? `http://localhost:5000${url}` : url;
  };

  return (
    <section id="about" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-2">
            <Terminal className="text-primary" /> About Me
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden border-2 border-border bg-muted relative z-10 flex flex-col items-center justify-center">
              {aboutData.image ? (
                <img src={resolveImg(aboutData.image)} alt="About Me" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary/50">
                  <span className="text-4xl mb-4">👨‍💻</span>
                  <p>Profile Image</p>
                  <p className="text-xs mt-2">Replace in assets folder</p>
                </div>
              )}
            </div>
            {/* Decorative background box */}
            <div className="absolute top-6 left-6 w-full h-full rounded-2xl border-2 border-primary -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6 text-lg text-muted-foreground"
          >
            <p>{aboutData.text1 || "Loading about details..."}</p>
            <p>{aboutData.text2}</p>
            {aboutData.text3 && <p>{aboutData.text3}</p>}
            <div className="pt-4 flex flex-col sm:flex-row gap-8">
              <div>
                <strong className="block text-3xl font-bold text-foreground mb-1">{aboutData.projectsCompleted || "0"}</strong>
                <span className="text-sm">Projects Completed</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
