import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../sections/Hero'
import { About } from '../sections/About'
import { Skills } from '../sections/Skills'
import { Projects } from '../sections/Projects'
import { Education } from '../sections/Education'
import { Certifications } from '../sections/Certifications'
import { Achievements } from '../sections/Achievements'
import { Internships } from '../sections/Internships'
import { Trainings } from '../sections/Trainings'
import { Contact } from '../sections/Contact'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // 1. Scroll progress bar at the top of the screen
    gsap.to('.scroll-progress-bar', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3
      }
    });

    // 2. Dynamic background color transition depending on the scroll position
    gsap.to(containerRef.current, {
      backgroundColor: '#0a0a0a', // Slightly darken the background to make sections pop
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "+=1000",
        scrub: true,
      }
    });

    // 3. Staggered reveal effect for all main sections with 3D rotation, blur and scale
    const sections = gsap.utils.toArray('main > section');
    sections.forEach((section, index) => {
      // Don't apply to the first section (Hero) since it has its own entrance animations
      if (index === 0) return;

      gsap.fromTo(section,
        {
          y: 100,
          scale: 0.95,
          opacity: 0,
          rotationX: 10,
          filter: 'blur(10px)'
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          rotationX: 0,
          filter: 'blur(0px)',
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%', // Trigger slightly earlier
            end: 'top 40%',
            scrub: 1.5, // Increase scrub for a smoother, floatier feel
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative transition-colors duration-1000">
      {/* Attractive gradient scroll progress bar */}
      <div className="scroll-progress-bar fixed top-0 left-0 h-1.5 w-full bg-gradient-to-r from-primary via-green-400 to-blue-500 origin-left scale-x-0 z-[100]" style={{ boxShadow: '0 0 10px var(--primary)' }} />

      <Navbar />
      <main className="overflow-hidden [perspective:1000px]">
        <Hero />
        <About />
        <Skills />
        <Internships />
        <Trainings />
        <Projects />
        <Education />
        <Certifications />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
