import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useGsapContext, useReducedMotion } from '@/hooks'
import { experienceEntries } from '@/data/portfolioData'
import '@/styles/experience.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Experience Section
 *
 * Vertical timeline with thin hairline connector — structurally identical
 * to Achievements but dedicated to actual work experience entries.
 * Uses the same sticky-date, scroll-driven reveal animation pattern.
 */
export function Experience() {
  const prefersReducedMotion = useReducedMotion()

  // Refs
  const headerRef = useRef<HTMLDivElement>(null)
  const entryRefs = useRef<(HTMLDivElement | null)[]>([])

  const animate = useCallback(
    (_ctx: gsap.Context) => {
      const header = headerRef.current

      // ── Reduced motion: everything visible immediately ──
      if (prefersReducedMotion) {
        if (header) gsap.set(header, { opacity: 1 })
        entryRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1 })
        })
        return
      }

      // ── Header entrance ──
      if (header) {
        const eyebrow = header.querySelector('.experience__eyebrow')
        const headline = header.querySelector('.experience__headline')

        if (eyebrow) {
          gsap.set(eyebrow, { y: 15, opacity: 0 })
          gsap.to(eyebrow, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })
        }

        if (headline) {
          gsap.set(headline, { y: 30, opacity: 0 })
          gsap.to(headline, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          })
        }
      }

      // ── Timeline entries stagger in ──
      entryRefs.current.forEach((entry) => {
        if (!entry) return

        const dot = entry.querySelector('.experience__dot')
        const dateEl = entry.querySelector('.experience__date')
        const roleEl = entry.querySelector('.experience__role')
        const bulletsEl = entry.querySelector('.experience__bullets')
        const stackEl = entry.querySelector('.experience__stack')

        // Initial state
        gsap.set(entry, { opacity: 0 })
        if (dot) gsap.set(dot, { scale: 0 })
        if (dateEl) gsap.set(dateEl, { x: -15, opacity: 0 })
        if (roleEl) gsap.set(roleEl, { y: 20, opacity: 0 })
        if (bulletsEl) gsap.set(bulletsEl, { y: 15, opacity: 0 })
        if (stackEl) gsap.set(stackEl, { y: 10, opacity: 0 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: entry,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        })

        tl.to(entry, { opacity: 1, duration: 0.3 }, 0)

        if (dot) {
          tl.to(
            dot,
            { scale: 1, duration: 0.5, ease: 'back.out(3)' },
            0.1
          )
        }

        if (dateEl) {
          tl.to(
            dateEl,
            { x: 0, opacity: 1, duration: 0.6, ease: 'expo.out' },
            0.15
          )
        }

        if (roleEl) {
          tl.to(
            roleEl,
            { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' },
            0.2
          )
        }

        if (bulletsEl) {
          tl.to(
            bulletsEl,
            { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' },
            0.35
          )
        }

        if (stackEl) {
          tl.to(
            stackEl,
            { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' },
            0.5
          )
        }
      })
    },
    [prefersReducedMotion]
  )

  const containerRef = useGsapContext(animate, [animate])

  return (
    <section
      id="experience"
      className="experience"
      ref={containerRef}
      aria-label="Experience"
    >
      {/* ── Section header ── */}
      <div className="experience__header" ref={headerRef}>
        <p className="experience__eyebrow">Experience</p>
        <h2 className="experience__headline">
          Where I've Been
          <span className="experience__headline-dot">.</span>
        </h2>
      </div>

      {/* ── Timeline ── */}
      <div className="experience__timeline">
        {experienceEntries.map((entry, i) => (
          <div
            key={`${entry.company}-${i}`}
            ref={(el) => { entryRefs.current[i] = el }}
            className="experience__entry"
          >
            <div className="experience__dot" />

            {/* Meta: date + location near the sticky marker */}
            <div className="experience__meta">
              <p className="experience__date">{entry.dates}</p>
              <p className="experience__location">{entry.location}</p>
            </div>

            {/* Role + Company as the headline */}
            <div className="experience__role">
              <h3 className="experience__role-title">{entry.role}</h3>
              <p className="experience__company">{entry.company}</p>
            </div>

            {/* Bullets */}
            <ul className="experience__bullets">
              {entry.bullets.map((bullet, j) => (
                <li key={j} className="experience__bullet">
                  {bullet}
                </li>
              ))}
            </ul>

            {/* Stack pill chips */}
            <div className="experience__stack">
              {entry.stack.map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
