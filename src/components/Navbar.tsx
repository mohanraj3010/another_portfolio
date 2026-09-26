import { useState, useEffect, useCallback, useRef } from 'react'
import { navLinks, navCta } from '@/data/portfolioData'
import '@/styles/navbar.css'

interface IndicatorStyle {
  left: number
  width: number
  opacity: number
}

/**
 * Floating Editorial Navbar (Phase 2 & Step 7 Pattern)
 *
 * - Wordmark "DEEPIKA" on the left
 * - Links: WORK, ABOUT, STACK, ACHIEVEMENTS, CONTACT in small tracked uppercase
 * - One pill CTA button on far right: RESUME
 * - Transparent over hero, subtle dark/blurred bar on scroll via single class toggle
 * - Active section link gets smooth underline slide as user scrolls
 */
export function Navbar() {
  const [activeSection, setActiveSection] = useState<string>('')
  const [scrolled, setScrolled] = useState<boolean>(false)
  const [hidden, setHidden] = useState<boolean>(false)
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
    opacity: 0,
  })

  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({})
  const linksContainerRef = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef<number>(0)

  // ── Scroll detection: Single class toggle for scrolled state + smart hide ──
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Single class toggle threshold (transparent over hero, blurred bar after 40px)
      setScrolled(currentScrollY > 40)

      // Hide on scroll down past 300px, reveal on scroll up
      if (currentScrollY > 300) {
        if (currentScrollY > lastScrollY.current + 8 && !mobileOpen) {
          setHidden(true)
        } else if (currentScrollY < lastScrollY.current - 12) {
          setHidden(false)
        }
      } else {
        setHidden(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mobileOpen])

  // ── Active Section Spy (IntersectionObserver) ──
  useEffect(() => {
    const sectionIds = ['projects', 'about', 'skills', 'achievements', 'contact']
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        })
      },
      {
        rootMargin: '-25% 0px -40% 0px',
        threshold: 0,
      }
    )

    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  // ── Smooth Underline Slide calculation ──
  useEffect(() => {
    const activeEl = linkRefs.current[activeSection]
    const containerEl = linksContainerRef.current

    if (activeEl && containerEl) {
      const containerRect = containerEl.getBoundingClientRect()
      const linkRect = activeEl.getBoundingClientRect()

      setIndicatorStyle({
        left: linkRect.left - containerRect.left,
        width: linkRect.width,
        opacity: 1,
      })
    } else {
      setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }))
    }
  }, [activeSection])

  // ── Lock body scroll when mobile drawer is open ──
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileOpen])

  // ── Smooth Scroll Navigation ──
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault()
      setMobileOpen(false)

      if (href === '#' || href === '') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      const target = document.querySelector(href)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    },
    []
  )

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <header
        className={`navbar-wrapper${
          scrolled ? ' navbar-wrapper--scrolled' : ''
        }${hidden ? ' navbar-wrapper--hidden' : ''}`}
      >
        <nav className="navbar-pill" aria-label="Main Navigation">
          {/* ── Wordmark "DEEPIKA" ── */}
          <a
            href="#"
            className="navbar__brand"
            onClick={handleBrandClick}
            aria-label="Deepika — Back to top"
          >
            DEEPIKA<span className="navbar__brand-dot">.</span>
          </a>

          <div className="navbar__divider" aria-hidden="true" />

          {/* ── Links (WORK, ABOUT, STACK, ACHIEVEMENTS, CONTACT) ── */}
          <div
            className="navbar__links"
            ref={linksContainerRef}
            role="menubar"
          >
            {/* Smooth sliding underline indicator */}
            <span
              className="navbar__indicator"
              style={{
                transform: `translateX(${indicatorStyle.left}px)`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
              aria-hidden="true"
            />

            {navLinks.map((link) => {
              const isActive = activeSection === link.href

              return (
                <a
                  key={link.label}
                  ref={(el) => {
                    linkRefs.current[link.href] = el
                  }}
                  href={link.href}
                  className={`navbar__link${
                    isActive ? ' navbar__link--active' : ''
                  }`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  role="menuitem"
                >
                  {link.label}
                </a>
              )
            })}
          </div>

          {/* ── Far Right Pill CTA Button (RESUME) ── */}
          <a
            href={navCta.href}
            download={navCta.downloadName}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__cta"
            aria-label="Download Resume"
          >
            {navCta.label}
          </a>

          {/* ── Mobile Hamburger Toggle ── */}
          <button
            type="button"
            className="navbar__toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </nav>
      </header>

      {/* ── Mobile Fullscreen Drawer ── */}
      <div
        className={`navbar-mobile-drawer${
          mobileOpen ? ' navbar-mobile-drawer--open' : ''
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="navbar-mobile-drawer__links">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`navbar-mobile-drawer__link${
                activeSection === link.href
                  ? ' navbar-mobile-drawer__link--active'
                  : ''
              }`}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={navCta.href}
            download={navCta.downloadName}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-mobile-drawer__cta"
            onClick={() => setMobileOpen(false)}
          >
            {navCta.label}
          </a>
        </div>
      </div>
    </>
  )
}
