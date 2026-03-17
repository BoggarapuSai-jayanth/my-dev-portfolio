import { Github, Linkedin, Twitter } from 'lucide-react'
import { usePortfolio } from '../../context/PortfolioContext'

export function Footer() {
  const { portfolioData } = usePortfolio();
  const heroData = portfolioData?.hero || {};

  const ensureUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  return (
    <footer className="border-t border-border py-12 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2 text-lg font-bold tracking-tighter">
            <span className="text-primary text-2xl">BSJ</span>
          </div>
          
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} Boggarapu Sai Jayanth. Built with React &amp; Tailwind CSS.
          </p>

          <div className="flex items-center gap-4 text-muted-foreground">
            {heroData.github && (
              <a href={ensureUrl(heroData.github)} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors p-2 rounded-md hover:bg-secondary" aria-label="GitHub">
                <Github size={20} />
              </a>
            )}
            {heroData.linkedin && (
              <a href={ensureUrl(heroData.linkedin)} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors p-2 rounded-md hover:bg-secondary" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            )}
            {heroData.twitter && (
              <a href={ensureUrl(heroData.twitter)} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors p-2 rounded-md hover:bg-secondary" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
