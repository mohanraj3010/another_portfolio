import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useGsapContext, useReducedMotion } from '@/hooks'
import { splitText } from '@/animations'
import { aboutData } from '@/data/portfolioData'
import '@/styles/about.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * About Section
 *
 * Editorial layout: asymmetric two-column with a confident headline,
 * tight narrative body, and oversized animated stat callouts.
 */
export function About() {
  const prefersReducedMotion = useReducedMotion()

  // Refs
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const statCard1Ref = useRef<HTMLDivElement>(null)
  const statCard2Ref = useRef<HTMLDivElement>(null)
  const decoLineRef = useRef<HTMLDivElement>(null)

  const animate = useCallback(
    (ctx: gsap.Context) => {
      const headlineEl = headlineRef.current
      const bodyEl = bodyRef.current
      const stat1 = statCard1Ref.current
      const stat2 = statCard2Ref.current
      const decoLine = decoLineRef.current

      if (!headlineEl) return

      // ── Reduced motion: instant visibility ──
      if (prefersReducedMotion) {
        gsap.set(
          [headlineEl, bodyEl, stat1, stat2].filter(Boolean),
          { opacity: 1 }
        )
        if (stat1) stat1.classList.add('about__stat-card--revealed')
        if (stat2) stat2.classList.add('about__stat-card--revealed')
        return
      }

      // ── Split headline into words ──
      const split = splitText(headlineEl, { type: 'words' })

      // ── Headline entrance ──
      gsap.set(split.words, { y: 60, opacity: 0 })
      gsap.to(split.words, {
        y: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: headlineEl,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      })

      // ── Body paragraphs stagger ──
      if (bodyEl) {
        const paragraphs = bodyEl.querySelectorAll('p')
        gsap.set(paragraphs, { y: 35, opacity: 0 })
        gsap.to(paragraphs, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: bodyEl,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }

      // ── Stat card 1: scale + reveal ──
      if (stat1) {
        const statValue1 = stat1.querySelector('.about__stat-value')
        const statLabel1 = stat1.querySelector('.about__stat-label')

        gsap.set(stat1, { opacity: 0 })
        if (statValue1) gsap.set(statValue1, { scale: 0.7, opacity: 0 })
        if (statLabel1) gsap.set(statLabel1, { y: 15, opacity: 0 })

        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: stat1,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        })

        tl1.to(stat1, { opacity: 1, duration: 0.3 }, 0)

        if (statValue1) {
          tl1.to(
            statValue1,
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: 'expo.out',
            },
            0
          )
        }

        if (statLabel1) {
          tl1.to(
            statLabel1,
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'expo.out',
            },
            0.3
          )
        }

        // Trigger the underline CSS animation
        tl1.call(() => {
          stat1.classList.add('about__stat-card--revealed')
        }, [], 0.5)
      }

      // ── Stat card 2: scale + reveal ──
      if (stat2) {
        const statValue2 = stat2.querySelector('.about__stat-value')
        const statLabel2 = stat2.querySelector('.about__stat-label')

        gsap.set(stat2, { opacity: 0 })
        if (statValue2) gsap.set(statValue2, { scale: 0.7, opacity: 0 })
        if (statLabel2) gsap.set(statLabel2, { y: 15, opacity: 0 })

        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: stat2,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        })

        tl2.to(stat2, { opacity: 1, duration: 0.3 }, 0)

        if (statValue2) {
          tl2.to(
            statValue2,
            {
              scale: 1,
              opacity: 1,
              duration: 1.2,
              ease: 'expo.out',
            },
            0.15
          )
        }

        if (statLabel2) {
          tl2.to(
            statLabel2,
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'expo.out',
            },
            0.4
          )
        }

        tl2.call(() => {
          stat2.classList.add('about__stat-card--revealed')
        }, [], 0.6)
      }

      // ── Decorative line parallax ──
      if (decoLine) {
        gsap.to(decoLine, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: ctx.scope as HTMLElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
    },
    [prefersReducedMotion]
  )

  const containerRef = useGsapContext(animate, [animate])

  /** Render headline parts, wrapping *text* in italic serif accent */
  const renderHeadline = () =>
    aboutData.headline.map((part, i) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        const text = part.slice(1, -1)
        return (
          <span key={i} className="about__headline-accent">
            {text}
          </span>
        )
      }
      // Add a space between words — except before the last
      return (
        <span key={i}>
          {part}
          {i < aboutData.headline.length - 1 ? ' ' : ''}
        </span>
      )
    })

  return (
    <section
      id="about"
      className="about"
      ref={containerRef}
      aria-label="About Deepika"
    >
      {/* Decorative vertical line */}
      <div className="about__deco-line" ref={decoLineRef} aria-hidden="true" />

      <div className="about__inner">
        {/* ── Left column: headline + body ── */}
        <div className="about__copy">
          <h2 className="about__headline" ref={headlineRef}>
            {renderHeadline()}
          </h2>

          <div className="about__body" ref={bodyRef}>
            {aboutData.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* ── Right column: stat callouts ── */}
        <div className="about__stats">
          <div className="about__stat-card" ref={statCard1Ref}>
            <span className="about__stat-value">{aboutData.statValue}</span>
            <p className="about__stat-label">{aboutData.statLabel}</p>
          </div>

          <div
            className="about__stat-card about__stat-card--secondary"
            ref={statCard2Ref}
          >
            <span className="about__stat-value">{aboutData.stat2Value}</span>
            <p className="about__stat-label">{aboutData.stat2Label}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
