import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

export function Education() {
  const { portfolioData } = usePortfolio();
  const educationList = portfolioData?.education || [];

  return (
    <section id="education" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-2">
            <GraduationCap className="text-primary" /> Education
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full" />
        </motion.div>

        <div className="relative border-l-2 border-border ml-3 md:ml-6 space-y-12 pb-8">
          {educationList.map((edu, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative pl-8 md:pl-12"
            >
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-background" />

              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                <h3 className="text-xl font-bold text-foreground">
                  {edu.degree} <span className="text-muted-foreground font-normal">@ {edu.institution}</span>
                </h3>
                <span className="text-sm font-medium text-primary mt-1 md:mt-0 font-mono">
                  {edu.duration}
                </span>
              </div>

              {(edu.status || edu.cgpa) && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {edu.status && (
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                      {edu.status}
                    </span>
                  )}
                  {edu.cgpa && (
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                      📊 {edu.cgpa}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
