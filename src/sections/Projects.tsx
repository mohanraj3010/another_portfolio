import { useRef, useCallback, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useGsapContext, useReducedMotion } from '@/hooks'
import { projects } from '@/data/portfolioData'
import '@/styles/projects.css'

gsap.registerPlugin(ScrollTrigger)

/**
 * ProjectPlaceholder
 * Clean, designed placeholder when a screenshot isn't available.
 */
function ProjectPlaceholder({ tags }: { tags: string[] }) {
  return (
    <div className="projects__placeholder">
      <div className="projects__placeholder-chips">
        {tags.map((tag) => (
          <span key={tag} className="chip chip--filled">
            {tag}
          </span>
        ))}
      </div>
      <span className="projects__placeholder-text">Preview Coming Soon</span>
    </div>
  )
}

/**
 * Projects Section
 *
 * Pinned full-bleed case-study slideshow. ScrollTrigger pins the section
 * while GSAP transitions between project slides. Each exit IS the next
 * entrance — shared crossfade, never a hard cut.
 */
export function Projects() {
  const prefersReducedMotion = useReducedMotion()
  const [loadedImages, setLoadedImages] = useState<Set<number>>(() => new Set([0, 1]))
  const progressFillRef = useRef<HTMLDivElement>(null)

  // Track which images failed to load → show placeholder
  const failedImages = useRef<Set<number>>(new Set())

  const handleImageError = useCallback((index: number) => {
    failedImages.current.add(index)
    // Force a re-render to show placeholder
    setLoadedImages((prev) => new Set(prev))
  }, [])

  const animate = useCallback(
    (ctx: gsap.Context) => {
      const pin = document.querySelector('.projects__pin') as HTMLElement
      if (!pin) return

      const slides = pin.querySelectorAll<HTMLElement>('.projects__slide')
      const count = slides.length
      if (count === 0) return

      // Show first slide
      slides[0].classList.add('projects__slide--active')
      gsap.set(slides[0], { opacity: 1, visibility: 'visible' })

      // ── Reduced motion: show first, no pinning ──
      if (prefersReducedMotion) {
        slides.forEach((slide, i) => {
          if (i === 0) {
            gsap.set(slide, { opacity: 1, visibility: 'visible' })
          } else {
            gsap.set(slide, { opacity: 0, visibility: 'hidden' })
          }
        })
        return
      }

      // ── Build responsive transitions with gsap.matchMedia() ──
      const mm = gsap.matchMedia()

      // Desktop (> 767px): Pinned full-bleed case-study slideshow
      mm.add('(min-width: 768px)', () => {
        // Show first slide
        slides[0].classList.add('projects__slide--active')
        gsap.set(slides[0], { opacity: 1, visibility: 'visible' })

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: ctx.scope as HTMLElement,
            start: 'top top',
            end: `+=${(count - 1) * 100}%`,
            scrub: 0.6,
            pin: pin,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progressFillRef.current) {
                gsap.set(progressFillRef.current, {
                  height: `${self.progress * 100}%`,
                })
              }

              const currentIdx = Math.floor(self.progress * (count - 1))
              const nextIdx = Math.min(currentIdx + 1, count - 1)
              setLoadedImages((prev) => {
                if (prev.has(currentIdx) && prev.has(nextIdx)) return prev
                const next = new Set(prev)
                next.add(currentIdx)
                next.add(nextIdx)
                return next
              })
            },
          },
        })

        // Build crossfade transitions between slides
        for (let i = 0; i < count - 1; i++) {
          const currentSlide = slides[i]
          const nextSlide = slides[i + 1]

          const currentImg = currentSlide.querySelector('.projects__image-wrap')
          const nextImg = nextSlide.querySelector('.projects__image-wrap')
          const currentContent = currentSlide.querySelector('.projects__content')
          const nextContent = nextSlide.querySelector('.projects__content')

          const position = i // timeline position

          // Current slide exit
          if (currentImg) {
            masterTl.to(
              currentImg,
              { scale: 1.05, opacity: 0, duration: 1, ease: 'power2.inOut' },
              position
            )
          }

          if (currentContent) {
            masterTl.to(
              currentContent,
              { x: -80, opacity: 0, duration: 0.8, ease: 'power3.in' },
              position
            )
          }

          masterTl.to(
            currentSlide,
            {
              opacity: 0,
              visibility: 'hidden',
              duration: 0.5,
              ease: 'none',
            },
            position + 0.5
          )

          // Next slide entrance
          masterTl.set(nextSlide, { opacity: 1, visibility: 'visible' }, position + 0.3)

          if (nextImg) {
            masterTl.fromTo(
              nextImg,
              { scale: 1.08, opacity: 0 },
              { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' },
              position + 0.35
            )
          }

          if (nextContent) {
            masterTl.fromTo(
              nextContent,
              { x: 60, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.9, ease: 'expo.out' },
              position + 0.45
            )
          }
        }
      })

      // Mobile (<= 767px): Remove pinning & scroll-jacking — fluid natural vertical scroll
      mm.add('(max-width: 767px)', () => {
        // Preload all slides for immediate visibility
        setLoadedImages(new Set(Array.from({ length: count }, (_, i) => i)))

        slides.forEach((slide) => {
          gsap.set(slide, { opacity: 1, visibility: 'visible' })
          const content = slide.querySelector('.projects__content')
          if (content) {
            gsap.fromTo(
              content,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: slide,
                  start: 'top 80%',
                  toggleActions: 'play none none none',
                },
              }
            )
          }
        })
      })
    },
    [prefersReducedMotion]
  )

  const containerRef = useGsapContext(animate, [animate])

  return (
    <section
      id="projects"
      className="projects"
      ref={containerRef}
      aria-label="Selected Projects"
    >
      <div className="projects__pin">
        {projects.map((project, index) => {
          const isLoaded = loadedImages.has(index)
          const hasFailed = failedImages.current.has(index)
          const showPlaceholder = !isLoaded || hasFailed

          return (
            <div
              key={project.id}
              className="projects__slide"
              aria-label={`Project ${project.num}: ${project.title}`}
            >
              {/* ── Image / Placeholder ── */}
              <div className="projects__image-wrap">
                {showPlaceholder ? (
                  <ProjectPlaceholder tags={project.tags} />
                ) : (
                  <img
                    className="projects__image"
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    loading="lazy"
                    decoding="async"
                    onError={() => handleImageError(index)}
                  />
                )}
              </div>
              <div className="projects__scrim" />
              <div className="projects__scrim-top" />

              {/* ── Content ── */}
              <div className="projects__content">
                <span className="projects__num">
                  Project {project.num}
                </span>

                <h3 className="projects__title">{project.title}</h3>

                <p className="projects__oneliner">{project.oneliner}</p>

                <div className="projects__chips">
                  {project.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="projects__link"
                  >
                    View on GitHub
                    <span className="projects__link-arrow">↗</span>
                  </a>
                )}
              </div>
            </div>
          )
        })}

        {/* ── Progress indicator ── */}
        <div className="projects__progress" aria-hidden="true">
          <span className="projects__progress-counter">
            {projects.length.toString().padStart(2, '0')}
          </span>
          <div className="projects__progress-bar">
            <div
              className="projects__progress-fill"
              ref={progressFillRef}
              style={{ height: '0%' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
