import { useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useGsapContext, useReducedMotion } from '@/hooks'
import { contactData } from '@/data/portfolioData'
import '@/styles/contact.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * Contact Section — The Final Frame / Deliberate Exhale
 *
 * Calm, premium closure after the energetic middle sections.
 * Huge editorial headline with an italic serif accent word,
 * hairline-separated link rows with subtle underline-draw and arrow-slide hover,
 * and quiet, minimal fade/settle animation.
 */
export function Contact() {
  const prefersReducedMotion = useReducedMotion()

  const headlineRef = useRef<HTMLHeadingElement>(null)
  const linkListRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const footerRef = useRef<HTMLDivElement>(null)

  const animate = useCallback(
    (_ctx: gsap.Context) => {
      const headline = headlineRef.current
      const linkList = linkListRef.current
      const footer = footerRef.current

      // ── Reduced motion: immediate visibility ──
      if (prefersReducedMotion) {
        if (headline) gsap.set(headline, { opacity: 1, y: 0 })
        linkRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 })
        })
        if (footer) gsap.set(footer, { opacity: 1 })
        return
      }

      // ── Headline: slow, calm fade & settle ──
      if (headline) {
        gsap.fromTo(
          headline,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: headline,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // ── Links: gentle stagger entrance ──
      linkRefs.current.forEach((link, idx) => {
        if (!link) return
        gsap.fromTo(
          link,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: 0.15 + idx * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: linkList || link,
              start: 'top 82%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      // ── Footer: soft fade-in ──
      if (footer) {
        gsap.fromTo(
          footer,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.0,
            delay: 0.35,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: footer,
              start: 'top 95%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    },
    [prefersReducedMotion]
  )

  const containerRef = useGsapContext(animate, [animate])

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  /** Render headline with italic serif accent word */
  const renderHeadline = () => {
    return contactData.headline.map((part, i) => {
      const isAccent = part.startsWith('*') && part.endsWith('*')
      const text = isAccent ? part.slice(1, -1) : part
      const needsTrailingSpace = i < contactData.headline.length - 1

      return (
        <span key={i}>
          {isAccent ? (
            <span className="contact__headline-accent">{text}</span>
          ) : (
            text
          )}
          {needsTrailingSpace ? ' ' : ''}
        </span>
      )
    })
  }

  return (
    <section
      id="contact"
      className="contact"
      ref={containerRef}
      aria-label="Contact and Social Links"
    >
      <div className="contact__inner">
        {/* ── Editorial Headline ── */}
        <h2 className="contact__headline" ref={headlineRef}>
          {renderHeadline()}
        </h2>

        {/* ── Editorial Link Rows ── */}
        <div className="contact__links" ref={linkListRef}>
          {contactData.links.map((link, idx) => {
            const isExternal = !link.href.startsWith('mailto:')

            return (
              <a
                key={link.label}
                ref={(el) => {
                  linkRefs.current[idx] = el
                }}
                href={link.href}
                className="contact__link-row"
                {...(isExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                aria-label={`${link.label}: ${link.display}`}
              >
                <span className="contact__link-label">{link.label}</span>
                <span className="contact__link-display">{link.display}</span>
                <svg
                  className="contact__link-arrow"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </a>
            )
          })}
        </div>

        {/* ── Quiet Footer / Settle ── */}
        <footer className="contact__footer" ref={footerRef}>
          <p className="contact__closing">{contactData.closing}</p>
          <button
            type="button"
            className="contact__back-top"
            onClick={handleScrollToTop}
            aria-label="Scroll back to top of page"
          >
            Back to Top &uarr;
          </button>
        </footer>
      </div>
    </section>
  )
}
