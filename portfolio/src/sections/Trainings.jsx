import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

export function Trainings() {
  const { portfolioData } = usePortfolio();
  const training = portfolioData?.training || [];

  if (training.length === 0) return null; // Don't show section if no training exists

  return (
    <section id="trainings" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="text-primary" /> Training
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full" />
        </motion.div>

        <div className="space-y-8">
          {training.map((item, idx) => (
            <motion.div
              key={item._id || idx}
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
                    {item.duration}
                  </span>
                  <p className="text-muted-foreground font-medium md:block hidden">{item.institution}</p>
                </div>

                <div className="bg-card p-6 md:p-8 rounded-2xl border border-border group-hover:border-primary/50 transition-colors shadow-sm relative">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-primary font-medium mb-4 md:hidden">{item.institution}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  {item.pdfUrl && (
                    <a
                      href={`http://localhost:5000${item.pdfUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                      <BookOpen size={16} /> View Document
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
