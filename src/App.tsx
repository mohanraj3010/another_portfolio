import { useLenis } from '@/hooks'
import { Navbar } from '@/components/Navbar'
import { CustomCursor } from '@/components/CustomCursor'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { Skills } from '@/sections/Skills'
import { Projects } from '@/sections/Projects'
import { Achievements } from '@/sections/Achievements'
import { Experience } from '@/sections/Experience'
import { Education } from '@/sections/Education'
import { Contact } from '@/sections/Contact'

function App() {
  // Boot Lenis smooth scroll + GSAP ticker sync
  useLenis()

  return (
    <>
      {/* Film-grain overlay — disabled on mobile via CSS media query */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Custom desktop cursor with soft trailing lag and pill morphing */}
      <CustomCursor />

      {/* Floating editorial navigation pill */}
      <Navbar />

      {/* Main scroll wrapper */}
      <main>
        {/* ── Sections composed as one continuous editorial flow ── */}
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Achievements />
        <Experience />
        <Education />
        <Contact />
      </main>
    </>
  )
}

export default App
