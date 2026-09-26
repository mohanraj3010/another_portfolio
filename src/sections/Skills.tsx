import { useRef, useCallback, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useGsapContext, useReducedMotion } from '@/hooks'
import '@/styles/skills.css'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════════
   SKILL WORD CONFIGURATION
   Each word is pre-positioned with a scatter coordinate,
   a size tier, and a parallax speed tier.
   ═══════════════════════════════════════════════════ */

type SizeTier = 'xl' | 'lg' | 'md' | 'sm'
type SpeedTier = 1 | 2 | 3 | 4

interface SkillWord {
  text: string
  size: SizeTier
  speed: SpeedTier
  /** Position as % of container (left, top) */
  x: number
  y: number
  /** Optional: outlined stroke style */
  outline?: boolean
  /** Optional: initial rotation (degrees) */
  rotate?: number
}

/**
 * Hand-art-directed positions for a cinematic scatter.
 * Coordinates are %-based so they scale across viewports.
 */
const SKILL_WORDS: SkillWord[] = [
  // ── Tier 1: XL — anchor words ──
  { text: 'REACT.JS',      size: 'xl', speed: 1, x: 5,  y: 8,   outline: true },
  { text: 'NODE.JS',       size: 'xl', speed: 2, x: 55, y: 60,  outline: false },

  // ── Tier 2: LG — secondary prominence ──
  { text: 'JAVASCRIPT',    size: 'lg', speed: 1, x: 42, y: 5,   rotate: -2 },
  { text: 'MONGODB',       size: 'lg', speed: 3, x: 8,  y: 52,  outline: true },
  { text: 'PYTHON',        size: 'lg', speed: 2, x: 62, y: 30,  rotate: 1 },

  // ── Tier 3: MD — supporting skills ──
  { text: 'EXPRESS.JS',    size: 'md', speed: 2, x: 30, y: 35 },
  { text: 'JAVA',          size: 'md', speed: 3, x: 75, y: 12,  rotate: 3 },
  { text: 'DSA',           size: 'md', speed: 1, x: 18, y: 78 },
  { text: 'HTML5',         size: 'md', speed: 4, x: 50, y: 82 },
  { text: 'SQL',           size: 'md', speed: 3, x: 82, y: 48,  rotate: -1 },

  // ── Tier 4: SM — ambient texture ──
  { text: 'CSS3',          size: 'sm', speed: 4, x: 35, y: 68 },
  { text: 'C',             size: 'sm', speed: 4, x: 88, y: 75,  rotate: -3 },
  { text: 'OOP',           size: 'sm', speed: 3, x: 70, y: 88 },
  { text: 'GIT',           size: 'sm', speed: 4, x: 5,  y: 35 },
  { text: 'REST APIs',     size: 'sm', speed: 2, x: 25, y: 22,  rotate: 2 },
]

/**
 * Parallax multipliers per speed tier.
 * Higher tier = slower movement = deeper layer.
 */
const SPEED_MULTIPLIERS: Record<SpeedTier, { y: number; x: number; scale: number }> = {
  1: { y: -100, x: -40,  scale: 0.04 },   // Fastest
  2: { y: -70,  x: 20,   scale: 0.02 },
  3: { y: -45,  x: -15,  scale: 0.01 },
  4: { y: -25,  x: 10,   scale: 0 },       // Slowest
}

/**
 * Rotation that tier-3 words accumulate on scroll
 * for an organic kinetic feel.
 */
const TIER_ROTATIONS: Partial<Record<SpeedTier, number>> = {
  1: 3,
  3: -2,
}

/**
 * Skills Section
 *
 * Large typographic scatter across the viewport. Words are grouped into
 * speed tiers that move at different scroll rates. Desktop-only mouse-proximity
 * micro-interaction nudges words away from the cursor.
 */
export function Skills() {
  const prefersReducedMotion = useReducedMotion()
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Refs
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const scatterRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const mousePos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number>(0)

  // Detect touch device
  useEffect(() => {
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    setIsTouchDevice(isTouch)
  }, [])

  const animate = useCallback(
    (ctx: gsap.Context) => {
      const scatter = scatterRef.current
      const eyebrow = eyebrowRef.current

      if (!scatter) return

      // ── Reduced motion: everything visible, no parallax ──
      if (prefersReducedMotion) {
        wordRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1 })
        })
        if (eyebrow) gsap.set(eyebrow, { opacity: 1 })
        return
      }

      // ── Eyebrow entrance ──
      if (eyebrow) {
        gsap.set(eyebrow, { y: 20, opacity: 0 })
        gsap.to(eyebrow, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: ctx.scope as HTMLElement,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      }

      // ── Word entrance stagger ──
      const wordEls = wordRefs.current.filter(Boolean) as HTMLSpanElement[]
      gsap.set(wordEls, { opacity: 0, y: 30 })

      gsap.to(wordEls, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: {
          each: 0.05,
          from: 'random',
        },
        ease: 'expo.out',
        scrollTrigger: {
          trigger: scatter,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      // ── Responsive scroll parallax via gsap.matchMedia() ──
      const mm = gsap.matchMedia()

      // Desktop (> 767px): Multi-speed scroll parallax tiers
      mm.add('(min-width: 768px)', () => {
        SKILL_WORDS.forEach((word, i) => {
          const el = wordRefs.current[i]
          if (!el) return

          const multiplier = SPEED_MULTIPLIERS[word.speed]
          const rotation = TIER_ROTATIONS[word.speed] ?? 0

          gsap.to(el, {
            y: multiplier.y,
            x: multiplier.x,
            scale: 1 + multiplier.scale,
            rotation: (word.rotate ?? 0) + rotation,
            ease: 'none',
            scrollTrigger: {
              trigger: scatter,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          })
        })

        // Hairline parallax
        const hairlines = scatter.querySelectorAll('.skills__hairline')
        hairlines.forEach((hl, i) => {
          gsap.to(hl, {
            y: -(20 + i * 15),
            ease: 'none',
            scrollTrigger: {
              trigger: scatter,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          })
        })
      })

      // Mobile (<= 767px): Collapse to a single gentle unified speed without multi-tier shear
      mm.add('(max-width: 767px)', () => {
        gsap.to(scatter, {
          y: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: scatter,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
      })
    },
    [prefersReducedMotion]
  )

  const containerRef = useGsapContext(animate, [animate])

  // ── Mouse proximity interaction (desktop only) ──
  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return

    const scatter = scatterRef.current
    if (!scatter) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = scatter.getBoundingClientRect()
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const updateProximity = () => {
      const { x: mx, y: my } = mousePos.current

      wordRefs.current.forEach((el) => {
        if (!el) return

        const rect = el.getBoundingClientRect()
        const scatterRect = scatterRef.current!.getBoundingClientRect()

        const elCenterX = rect.left - scatterRect.left + rect.width / 2
        const elCenterY = rect.top - scatterRect.top + rect.height / 2

        const dx = elCenterX - mx
        const dy = elCenterY - my
        const distance = Math.sqrt(dx * dx + dy * dy)

        const radius = 200 // proximity radius in px
        if (distance < radius && distance > 0) {
          const strength = (1 - distance / radius) * 12 // max 12px nudge
          const offsetX = (dx / distance) * strength
          const offsetY = (dy / distance) * strength

          gsap.to(el, {
            '--nudge-x': `${offsetX}px`,
            '--nudge-y': `${offsetY}px`,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        } else {
          gsap.to(el, {
            '--nudge-x': '0px',
            '--nudge-y': '0px',
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto',
          })
        }
      })

      rafId.current = requestAnimationFrame(updateProximity)
    }

    scatter.addEventListener('mousemove', handleMouseMove)
    rafId.current = requestAnimationFrame(updateProximity)

    return () => {
      scatter.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [isTouchDevice, prefersReducedMotion])

  return (
    <section
      id="skills"
      className="skills"
      ref={containerRef}
      aria-label="Technical Skills"
    >
      <p className="skills__eyebrow" ref={eyebrowRef}>
        Tools &amp; Technologies
      </p>

      <div className="skills__scatter" ref={scatterRef}>
        {/* Decorative hairlines */}
        <div
          className="skills__hairline skills__hairline--h"
          style={{ left: '10%', top: '25%', opacity: 0.4 }}
          aria-hidden="true"
        />
        <div
          className="skills__hairline skills__hairline--v"
          style={{ right: '20%', top: '10%', opacity: 0.3 }}
          aria-hidden="true"
        />
        <div
          className="skills__hairline skills__hairline--h"
          style={{ right: '5%', bottom: '20%', opacity: 0.25, width: '20vw' }}
          aria-hidden="true"
        />

        {/* Skill words */}
        {SKILL_WORDS.map((word, i) => (
          <span
            key={word.text}
            ref={(el) => { wordRefs.current[i] = el }}
            className={[
              'skills__word',
              `skills__word--${word.size}`,
              word.outline ? 'skills__word--outline' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{
              left: `${word.x}%`,
              top: `${word.y}%`,
              transform: `rotate(${word.rotate ?? 0}deg) translate(var(--nudge-x, 0px), var(--nudge-y, 0px))`,
            } as React.CSSProperties}
            aria-label={word.text}
          >
            {word.text}
          </span>
        ))}
      </div>
    </section>
  )
}
