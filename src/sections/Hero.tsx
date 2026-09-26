import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useGsapContext, useReducedMotion } from '@/hooks'
import { splitText } from '@/animations'
import { heroData } from '@/data/portfolioData'
import heroPortrait from '@/assets/portrait.jpeg'
import '@/styles/hero.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Hero Section
 *
 * Editorial composition: oversized wordmark + asymmetric clipped portrait
 * + staggered pills. Full GSAP timeline entrance + scroll-driven parallax.
 */
export function Hero() {
  const prefersReducedMotion = useReducedMotion()

  // Refs for animation targets
  const wordmarkRef = useRef<HTMLHeadingElement>(null)
  const accentRef = useRef<HTMLSpanElement>(null)
  const supportRef = useRef<HTMLDivElement>(null)
  const pillsRef = useRef<HTMLDivElement>(null)
  const portraitMaskRef = useRef<HTMLDivElement>(null)
  const portraitImgRef = useRef<HTMLImageElement>(null)
  const decoNumeralRef = useRef<HTMLDivElement>(null)
  const decoLine1Ref = useRef<HTMLDivElement>(null)
  const decoLine2Ref = useRef<HTMLDivElement>(null)
  const decoLine3Ref = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  // Store split revert so cleanup can call it
  const splitRevertRef = useRef<(() => void) | null>(null)

  const animate = useCallback(
    (ctx: gsap.Context) => {
      const wordmarkEl = wordmarkRef.current
      const accentEl = accentRef.current
      const supportEl = supportRef.current
      const pillsEl = pillsRef.current
      const portraitMask = portraitMaskRef.current
      const portraitImg = portraitImgRef.current
      const decoNumeral = decoNumeralRef.current
      const scrollHint = scrollHintRef.current

      if (!wordmarkEl || !portraitMask || !portraitImg) return

      // ───────────────────────────────────
      // REDUCED MOTION: simple cross-fade
      // ───────────────────────────────────
      if (prefersReducedMotion) {
        gsap.set(
          [wordmarkEl, accentEl, supportEl, pillsEl, portraitMask, scrollHint].filter(Boolean),
          { opacity: 1 }
        )
        return
      }

      // ───────────────────────────────────
      // SPLIT TEXT — wordmark characters
      // ───────────────────────────────────
      const split = splitText(wordmarkEl, { type: 'chars' })
      splitRevertRef.current = split.revert

      // ───────────────────────────────────
      // INITIAL STATES
      // ───────────────────────────────────
      gsap.set(split.chars, { y: 80, opacity: 0 })
      gsap.set(portraitMask, {
        clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
      })
      gsap.set(portraitImg, { scale: 1.15 })

      if (accentEl) gsap.set(accentEl, { y: 30, opacity: 0 })
      if (supportEl) gsap.set(supportEl, { y: 25, opacity: 0 })
      if (pillsEl) {
        const pills = pillsEl.querySelectorAll('.hero__pill')
        gsap.set(pills, { y: 15, opacity: 0 })
      }
      if (decoNumeral) gsap.set(decoNumeral, { opacity: 0 })
      if (scrollHint) gsap.set(scrollHint, { opacity: 0 })

      // ───────────────────────────────────
      // ENTRANCE TIMELINE (one-time, on load)
      // ───────────────────────────────────
      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        delay: 0.3,
      })

      // Portrait mask wipe open
      tl.to(
        portraitMask,
        {
          clipPath: 'polygon(18% 0%, 100% 0%, 100% 100%, 8% 100%)',
          duration: 1.6,
          ease: 'power4.inOut',
        },
        0
      )

      // Portrait image settle from slight zoom
      tl.to(
        portraitImg,
        {
          scale: 1,
          duration: 2.0,
          ease: 'power3.out',
        },
        0.2
      )

      // Wordmark char stagger
      tl.to(
        split.chars,
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          stagger: 0.04,
          ease: 'expo.out',
        },
        0.4
      )

      // Accent word
      if (accentEl) {
        tl.to(
          accentEl,
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'expo.out',
          },
          0.8
        )
      }

      // Supporting text
      if (supportEl) {
        tl.to(
          supportEl,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'expo.out',
          },
          1.0
        )
      }

      // Pills staggered
      if (pillsEl) {
        const pills = pillsEl.querySelectorAll('.hero__pill')
        tl.to(
          pills,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'expo.out',
          },
          1.1
        )
      }

      // Deco numeral fade in
      if (decoNumeral) {
        tl.to(
          decoNumeral,
          {
            opacity: 0.6,
            duration: 1.5,
            ease: 'power2.out',
          },
          0.6
        )
      }

      // Scroll hint
      if (scrollHint) {
        tl.to(
          scrollHint,
          {
            opacity: 0.4,
            duration: 0.8,
            ease: 'power2.out',
          },
          1.6
        )
      }

      // ───────────────────────────────────
      // SCROLL PARALLAX via matchMedia()
      // Desktop (> 767px): Multi-speed parallax tiers
      // Mobile (<= 767px): Single unified speed drift
      // ───────────────────────────────────
      const mm = gsap.matchMedia()

      mm.add('(min-width: 768px)', () => {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: ctx.scope as HTMLElement,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        })

        // Speed 1 — Headline moves left quickly
        scrollTl.to(
          wordmarkEl,
          {
            x: -120,
            opacity: 0.3,
            ease: 'none',
          },
          0
        )

        // Speed 2 — Portrait shifts + scales (true parallax)
        scrollTl.to(
          portraitImg,
          {
            y: -80,
            scale: 1.08,
            ease: 'none',
          },
          0
        )

        // Speed 3 — Support text, slower than headline
        if (supportEl) {
          scrollTl.to(
            supportEl,
            {
              x: -50,
              opacity: 0,
              ease: 'none',
            },
            0
          )
        }

        // Accent word parallax
        if (accentEl) {
          scrollTl.to(
            accentEl,
            {
              x: -70,
              opacity: 0,
              ease: 'none',
            },
            0
          )
        }

        // Speed 4 — Deco layer, slowest drift
        if (decoNumeral) {
          scrollTl.to(
            decoNumeral,
            {
              y: -40,
              ease: 'none',
            },
            0
          )
        }

        // Deco lines — very subtle drift
        const decoLines = [decoLine1Ref.current, decoLine2Ref.current, decoLine3Ref.current].filter(Boolean)
        decoLines.forEach((line, i) => {
          scrollTl.to(
            line!,
            {
              y: -(15 + i * 10),
              ease: 'none',
            },
            0
          )
        })

        // Pills fade out early
        if (pillsEl) {
          scrollTl.to(
            pillsEl,
            {
              y: -20,
              opacity: 0,
              ease: 'none',
            },
            0
          )
        }

        // Scroll hint fades out early
        if (scrollHint) {
          scrollTl.to(
            scrollHint,
            {
              opacity: 0,
              ease: 'none',
            },
            0
          )
        }
      })

      mm.add('(max-width: 767px)', () => {
        // Mobile: collapse multi-speed parallax tiers to a single gentle speed
        const mobileScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: ctx.scope as HTMLElement,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        })

        mobileScrollTl.to(
          ['.hero__content', portraitMask],
          {
            y: -35,
            opacity: 0.25,
            ease: 'none',
          },
          0
        )

        if (scrollHint) {
          mobileScrollTl.to(
            scrollHint,
            {
              opacity: 0,
              ease: 'none',
            },
            0
          )
        }
      })
    },
    [prefersReducedMotion]
  )

  // gsap.context scoped to the hero container
  const containerRef = useGsapContext(animate, [animate])

  return (
    <section
      id="hero"
      className="hero"
      ref={containerRef}
      aria-label="Hero — Deepika N.B."
    >
      {/* ── Decorative depth layer ── */}
      <div className="hero__deco" aria-hidden="true">
        <div className="hero__deco-numeral" ref={decoNumeralRef}>
          D
        </div>
        <div
          className="hero__deco-line hero__deco-line--1"
          ref={decoLine1Ref}
        />
        <div
          className="hero__deco-line hero__deco-line--2"
          ref={decoLine2Ref}
        />
        <div
          className="hero__deco-line hero__deco-line--3"
          ref={decoLine3Ref}
        />
      </div>

      {/* ── Portrait ── */}
      <div className="hero__portrait-wrap" aria-hidden="true">
        <div className="hero__portrait-mask" ref={portraitMaskRef}>
          <img
            ref={portraitImgRef}
            className="hero__portrait-img"
            src={heroPortrait}
            alt={heroData.heroImageAlt}
            width={800}
            height={1200}
            loading="eager"
            fetchPriority="high"
          />
          <div className="hero__portrait-scrim" />
          <div className="hero__portrait-scrim-bottom" />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="hero__content">
        {/* Wordmark headline */}
        <h1 className="hero__wordmark" ref={wordmarkRef}>
          {heroData.wordmark}
        </h1>

        {/* Italic accent word */}
        <span className="hero__accent-word" ref={accentRef}>
          {heroData.accentWord}
        </span>

        {/* Supporting copy */}
        <div className="hero__support" ref={supportRef}>
          <p className="hero__role">{heroData.role}</p>
          <p className="hero__tagline">{heroData.tagline}</p>
        </div>

        {/* Pill / chip cluster */}
        <div className="hero__pills" ref={pillsRef}>
          {heroData.pills.map((pill, i) => (
            <span
              key={pill}
              className={`hero__pill${
                pill.includes('OPEN TO') ? ' hero__pill--accent' : ''
              }`}
            >
              {i > 0 && <span className="hero__pill-dot" />}
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="hero__scroll-hint" ref={scrollHintRef}>
        <span className="hero__scroll-hint-text">Scroll</span>
        <div className="hero__scroll-hint-line" />
      </div>
    </section>
  )
}
