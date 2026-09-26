import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Initializes Lenis smooth scrolling, syncs it to gsap.ticker (single RAF),
 * and wires ScrollTrigger as the single scroll source-of-truth.
 *
 * Returns the Lenis instance ref so components can call lenis.scrollTo() etc.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Respect reduced-motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
      infinite: false,
    })

    lenisRef.current = lenis

    // Sync Lenis → GSAP ticker (single RAF loop)
    lenis.on('scroll', ScrollTrigger.update)

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000) // GSAP ticker is in seconds, Lenis expects ms
    }

    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0) // prevent GSAP from pausing on tab switch

    return () => {
      lenis.destroy()
      gsap.ticker.remove(updateTicker)
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
