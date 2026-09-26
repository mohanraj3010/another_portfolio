import { useEffect, useRef, useState } from 'react'
import '@/styles/cursor.css'

interface CursorState {
  visible: boolean
  isHover: boolean
  isPill: boolean
  isAccentPill: boolean
  label: string
}

/**
 * Custom Cursor (Desktop Only)
 *
 * Smooth trailing lag effect using requestAnimationFrame and transform: translate3d().
 * Morphs into a chip/pill label ("VIEW", "OPEN", etc.) over project entries and links.
 * Fully disabled on touch devices and screen widths <= 767px.
 */
export function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>({
    visible: false,
    isHover: false,
    isPill: false,
    isAccentPill: false,
    label: '',
  })

  const cursorRef = useRef<HTMLDivElement>(null)
  const targetPos = useRef({ x: -100, y: -100 })
  const currentPos = useRef({ x: -100, y: -100 })
  const animFrameId = useRef<number | null>(null)
  const isEnabled = useRef<boolean>(false)

  useEffect(() => {
    // Check if touch or mobile device
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 767px)').matches ||
      'ontouchstart' in window

    if (isTouch) {
      isEnabled.current = false
      return
    }

    isEnabled.current = true

    // ── Mouse Move & Enter/Leave ──
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current.x = e.clientX
      targetPos.current.y = e.clientY

      setCursorState((prev) => (prev.visible ? prev : { ...prev, visible: true }))
    }

    const handleMouseLeave = () => {
      setCursorState((prev) => ({ ...prev, visible: false }))
    }

    const handleMouseEnter = () => {
      setCursorState((prev) => ({ ...prev, visible: true }))
    }

    // ── Element Hover Detection (Event Delegation) ──
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      // Check for explicit data-cursor attribute
      const cursorAttrEl = target.closest('[data-cursor]') as HTMLElement | null
      if (cursorAttrEl) {
        const customLabel = cursorAttrEl.getAttribute('data-cursor') || 'VIEW'
        setCursorState((prev) => ({
          ...prev,
          isHover: true,
          isPill: true,
          isAccentPill: customLabel === 'VIEW',
          label: customLabel,
        }))
        return
      }

      // Check for project slide or case study links
      const projectEl = target.closest('.projects__slide, .projects__link, .projects__image-wrap')
      if (projectEl) {
        setCursorState((prev) => ({
          ...prev,
          isHover: true,
          isPill: true,
          isAccentPill: true,
          label: 'VIEW',
        }))
        return
      }

      // Check for external link or contact row
      const linkEl = target.closest('a, button, [role="button"]') as HTMLAnchorElement | null
      if (linkEl) {
        const isExternal =
          linkEl.target === '_blank' ||
          (linkEl.href && !linkEl.href.includes(window.location.hostname) && !linkEl.href.startsWith('#'))

        if (isExternal) {
          setCursorState((prev) => ({
            ...prev,
            isHover: true,
            isPill: true,
            isAccentPill: false,
            label: 'OPEN',
          }))
        } else {
          setCursorState((prev) => ({
            ...prev,
            isHover: true,
            isPill: false,
            isAccentPill: false,
            label: '',
          }))
        }
        return
      }

      // Default state when over non-interactive elements
      setCursorState((prev) => ({
        ...prev,
        isHover: false,
        isPill: false,
        isAccentPill: false,
        label: '',
      }))
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseover', handleMouseOver, { passive: true })

    // ── Smooth Trailing Lag Loop via requestAnimationFrame ──
    const lerpFactor = 0.18 // Soft trailing delay factor

    const render = () => {
      // Linear interpolation between current and target
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor

      if (cursorRef.current) {
        // Hardware-accelerated translate3d
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) translate(-50%, -50%)`
      }

      animFrameId.current = requestAnimationFrame(render)
    }

    animFrameId.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseover', handleMouseOver)
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current)
      }
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor${
        cursorState.visible ? ' custom-cursor--visible' : ''
      }${cursorState.isHover && !cursorState.isPill ? ' custom-cursor--hover' : ''}${
        cursorState.isPill ? ' custom-cursor--pill' : ''
      }${cursorState.isAccentPill ? ' custom-cursor--pill-accent' : ''}`}
      aria-hidden="true"
    >
      <span className="custom-cursor__label">{cursorState.label}</span>
    </div>
  )
}
