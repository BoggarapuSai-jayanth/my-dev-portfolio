import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { ArrowRight, Download, Github, Linkedin, Mail } from 'lucide-react'
import { usePortfolio } from '../context/PortfolioContext'

// Generate comets for the 3D background
const comets = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  top: Math.random() * 100, // random start height
  left: Math.random() * 100, // random start width
  duration: Math.random() * 3 + 2, // 2s to 5s falling speed
  delay: Math.random() * 5, // random delay
}));

export function Hero() {
  const { portfolioData } = usePortfolio();
  const heroData = portfolioData?.hero || {};

  // Ensure external URLs always have a protocol so the browser doesn't treat them as relative paths
  const ensureUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  };

  const handleDownloadResume = async () => {
    if (!heroData.resumeUrl) return;
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}${heroData.resumeUrl}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download resume:', err);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background [perspective:1000px]">
      {/* ── 3D Comets Background ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none [transform-style:preserve-3d]">

        {/* Deep background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] opacity-50 animate-pulse" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />

        {/* Night sky stars */}
        <div className="absolute inset-0 opacity-40" style={{ background: 'radial-gradient(circle at center, transparent 0%, #000 100%)' }} />

        {/* 3D Comets Container */}
        <div className="absolute inset-0 [transform:rotateX(60deg)_rotateZ(-45deg)_scale(1.5)]">
          {comets.map((c) => (
            <div
              key={c.id}
              className="absolute animate-comet"
              style={{
                top: `${c.top}%`,
                left: `${c.left}%`,
                animationDuration: `${c.duration}s`,
                animationDelay: `${c.delay}s`,
              }}
            >
              {/* Comet head and tail */}
              <div className="w-[2px] h-[150px] bg-gradient-to-t from-transparent via-primary/50 to-white rounded-full shadow-[0_0_10px_#fff,0_0_20px_var(--primary)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md px-4 py-1.5 text-sm font-semibold mb-8 hover:bg-primary/20 hover:border-primary/50 transition-colors cursor-default shadow-[0_0_15px_rgba(var(--primary),0.1)]"
        >
          <span className="relative flex h-2.5 w-2.5 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          Available for new opportunities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6"
        >
          {heroData.greeting || "Hi, I'm"} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-400 to-sky-500 animate-gradient-x">
            {heroData.name || "Boggarapu Sai Jayanth"}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-[650px] mb-10 leading-relaxed drop-shadow-sm"
        >
          {heroData.description || "Loading developer details..."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Button size="lg" className="w-full sm:w-auto gap-2 group shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all" onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}>
            View My Work <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
          {heroData.resumeUrl && (
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 group hover:bg-secondary/50 transition-all border-border hover:border-primary/30" onClick={handleDownloadResume}>
              <Download size={18} className="group-hover:-translate-y-1 transition-transform" /> Download Resume
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-6 text-muted-foreground"
        >
          {[
            { Icon: Github, href: ensureUrl(heroData.github), label: 'GitHub' },
            { Icon: Linkedin, href: ensureUrl(heroData.linkedin), label: 'LinkedIn' },
            { Icon: Mail, href: `mailto:${heroData.email || ''}`, label: 'Email' }
          ].map(({ Icon, href, label }, idx) => (
            <a
              key={idx}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="p-3 rounded-full bg-secondary/30 hover:bg-primary/20 hover:text-primary transition-all border border-transparent hover:border-primary/30 animate-float"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <Icon size={22} className="drop-shadow-sm" />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Global styles for 3D comet animation */}
      <style jsx="true">{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 4s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes comet-fall {
          0% {
            transform: translateY(-20vh);
            opacity: 1;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(150vh);
            opacity: 0;
          }
        }
        .animate-comet {
          animation: comet-fall linear infinite;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
