import { motion } from 'framer-motion'
import { Github, ExternalLink, Sparkles } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

export function Projects() {
  const { portfolioData } = usePortfolio();
  const projects = portfolioData?.projects || [];

  const resolveImg = (url) => {
    if (!url) return '';
    return url.startsWith('/uploads') ? `http://localhost:5000${url}` : url;
  };

  return (
    <section id="projects" className="relative py-32 overflow-hidden bg-background">
      {/* Background Decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
            <Sparkles size={16} />
            <span className="text-sm font-semibold tracking-wider uppercase">Portfolio</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A selection of my recent work, showcasing my skills in building scalable, aesthetic, and user-centric applications.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projects.map((project, idx) => (
            <motion.div
              key={project._id || idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
              className="group relative flex flex-col h-full rounded-3xl bg-card border border-border/50 overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
            >
              {/* Image Section */}
              <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                {project.image ? (
                  <img src={resolveImg(project.image)} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/50 text-muted-foreground transform group-hover:scale-110 transition-transform duration-700 ease-in-out">
                    No Image Available
                  </div>
                )}

                {/* Overlay Links on Image Hover */}
                <div className="absolute inset-0 z-20 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:border-primary transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 delay-100">
                      <Github size={22} />
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noreferrer" className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:border-primary transition-all transform translate-y-8 group-hover:translate-y-0 duration-500 delay-150">
                      <ExternalLink size={22} />
                    </a>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-grow p-8 relative z-10 bg-gradient-to-b from-card to-card/90">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags?.map(tag => (
                    <span key={tag} className="text-xs font-medium px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-lg border border-primary/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
