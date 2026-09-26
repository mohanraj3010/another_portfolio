import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Returns a ref to scope gsap.context() to a component root.
 * All GSAP animations created inside the component are auto-cleaned on unmount.
 *
 * Usage:
 *   const containerRef = useGsapContext(() => {
 *     gsap.to('.my-element', { opacity: 1 })
 *   }, [deps])
 */
export function useGsapContext(
  callback: (ctx: gsap.Context) => void,
  deps: React.DependencyList = []
) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context((self) => {
      callback(self)
    }, containerRef.current)

    return () => {
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return containerRef
}
