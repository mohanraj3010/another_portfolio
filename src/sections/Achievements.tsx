import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useGsapContext, useReducedMotion } from '@/hooks'
import { achievements } from '@/data/portfolioData'
import '@/styles/achievements.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Achievements Section
 *
 * Vertical timeline with thin hairline connector, small date labels,
 * and larger titles. Replaces "Experience" since there's no internship yet.
 * Styled like a premium journal/case-study timeline.
 */
export function Achievements() {
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
        const eyebrow = header.querySelector('.achievements__eyebrow')
        const headline = header.querySelector('.achievements__headline')

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

        const dot = entry.querySelector('.achievements__dot')
        const dateEl = entry.querySelector('.achievements__date')
        const titleEl = entry.querySelector('.achievements__title')
        const detailEl = entry.querySelector('.achievements__detail')

        // Initial state
        gsap.set(entry, { opacity: 0 })
        if (dot) gsap.set(dot, { scale: 0 })
        if (dateEl) gsap.set(dateEl, { x: -15, opacity: 0 })
        if (titleEl) gsap.set(titleEl, { y: 20, opacity: 0 })
        if (detailEl) gsap.set(detailEl, { y: 15, opacity: 0 })

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

        if (titleEl) {
          tl.to(
            titleEl,
            { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' },
            0.2
          )
        }

        if (detailEl) {
          tl.to(
            detailEl,
            { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' },
            0.35
          )
        }
      })
    },
    [prefersReducedMotion]
  )

  const containerRef = useGsapContext(animate, [animate])

  return (
    <section
      id="achievements"
      className="achievements"
      ref={containerRef}
      aria-label="Achievements"
    >
      {/* ── Section header ── */}
      <div className="achievements__header" ref={headerRef}>
        <p className="achievements__eyebrow">Achievements</p>
        <h2 className="achievements__headline">
          Proof Points,{' '}
          <span className="achievements__headline-accent">Not Promises</span>
        </h2>
      </div>

      {/* ── Timeline ── */}
      <div className="achievements__timeline">
        {achievements.map((item, i) => (
          <div
            key={`${item.title}-${i}`}
            ref={(el) => { entryRefs.current[i] = el }}
            className={`achievements__entry${
              item.accent ? ' achievements__entry--accent' : ''
            }`}
          >
            <div className="achievements__dot" />
            <p className="achievements__date">{item.date}</p>
            <h3 className="achievements__title">
              {item.title}
              {item.tag && (
                <span className="achievements__tag">{item.tag}</span>
              )}
            </h3>
            <p className="achievements__detail">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
