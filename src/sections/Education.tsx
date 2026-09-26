import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useGsapContext, useReducedMotion } from '@/hooks'
import { educationEntries } from '@/data/portfolioData'
import '@/styles/education.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Education Section — Editorial Timeline
 *
 * Visually calm timeline with thin hairline rules, generous spacing,
 * and no scroll-jacking. Gentle scroll-triggered settle animation.
 */
export function Education() {
  const prefersReducedMotion = useReducedMotion()

  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const entryRefs = useRef<(HTMLDivElement | null)[]>([])

  const animate = useCallback(
    (_ctx: gsap.Context) => {
      // ── Reduced motion: visible immediately ──
      if (prefersReducedMotion) {
        if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 1, y: 0 })
        entryRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 })
        })
        return
      }

      // ── Eyebrow fade & settle ──
      if (eyebrowRef.current) {
        gsap.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: eyebrowRef.current,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // ── Entries calm fade & settle ──
      entryRefs.current.forEach((entry) => {
        if (!entry) return
        gsap.fromTo(
          entry,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: entry,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    },
    [prefersReducedMotion]
  )

  const containerRef = useGsapContext(animate, [animate])

  return (
    <section
      id="education"
      className="education"
      ref={containerRef}
      aria-label="Education and Background"
    >
      <div className="education__inner">
        <p className="education__eyebrow" ref={eyebrowRef}>
          Education
        </p>

        <div className="education__entries">
          {educationEntries.map((item, i) => (
            <div
              key={`${item.label}-${i}`}
              ref={(el) => {
                entryRefs.current[i] = el
              }}
              className={`education__entry${
                item.accent ? ' education__entry--accent' : ''
              }`}
            >
              <div className="education__label">{item.label}</div>
              <div className="education__info">
                <h3 className="education__degree">{item.degree}</h3>
                <p className="education__institution">{item.institution}</p>
                <span className="education__detail">{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
