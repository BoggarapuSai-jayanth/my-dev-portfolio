import { motion } from 'framer-motion'
import { Award, ExternalLink } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

export function Certifications() {
  const { portfolioData } = usePortfolio();
  const certifications = portfolioData?.certifications || [];

  return (
    <section id="certifications" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-2">
            <Award className="text-primary" /> Certifications & Courses
          </h2>
          <div className="w-20 h-1 bg-primary rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all group flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-2">
                  {cert.title}
                </h3>
                <p className="text-muted-foreground font-medium mb-1">{cert.issuer}</p>
                <p className="text-sm text-muted-foreground/80 mb-6">{cert.date}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-auto">
                {cert.link && (
                  <a
                    href={cert.link}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline w-fit"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Credential <ExternalLink size={16} />
                  </a>
                )}
                {cert.pdfUrl && (
                  <a
                    href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${cert.pdfUrl}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md transition-colors w-fit"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View PDF Certificate
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
