import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

export function Internships() {
  const { portfolioData } = usePortfolio();
  const internships = portfolioData?.internships || [];

  if (internships.length === 0) return null; // Don't show section if no internships exist

  return (
    <section id="internships" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-2">
            <Briefcase className="text-primary" /> Internships
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full" />
        </motion.div>

        <div className="space-y-8">
          {internships.map((internship, idx) => (
            <motion.div
              key={internship._id || idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              {/* Timeline line on mobile */}
              <div className="md:hidden absolute left-0 top-2 bottom-0 w-0.5 bg-border rounded-full" />

              <div className="grid md:grid-cols-[1fr_3fr] gap-4 md:gap-8 items-start group">
                <div className="relative md:text-right pt-2">
                  {/* Timeline dot */}
                  <div className="absolute left-[-37px] md:left-auto md:right-[-25px] top-4 w-4 h-4 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors" />

                  {/* Desktop Timeline line */}
                  <div className="hidden md:block absolute right-[-18px] top-8 bottom-[-3rem] w-0.5 bg-border rounded-full" />

                  <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-full mb-2">
                    {internship.duration}
                  </span>
                  <p className="text-muted-foreground font-medium md:block hidden">{internship.company}</p>
                </div>

                <div className="bg-card p-6 md:p-8 rounded-2xl border border-border group-hover:border-primary/50 transition-colors shadow-sm relative">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">{internship.role}</h3>
                  <p className="text-primary font-medium mb-4 md:hidden">{internship.company}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {internship.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
