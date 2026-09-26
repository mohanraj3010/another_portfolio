/**
 * Manual char/word/line splitter for text-reveal animations.
 * Avoids SplitText license dependency — works with GSAP free tier.
 *
 * Usage:
 *   const { chars, words, lines } = splitText(element, { type: 'chars,words' })
 *
 * Returns arrays of <span> wrappers that can be targeted by gsap.from/to.
 * Call revert() to restore the original innerHTML.
 */

export interface SplitResult {
  chars: HTMLSpanElement[]
  words: HTMLSpanElement[]
  lines: HTMLSpanElement[]
  revert: () => void
}

export interface SplitOptions {
  type?: string // comma-separated: 'chars', 'words', 'lines'
  linesClass?: string
  wordsClass?: string
  charsClass?: string
}

export function splitText(
  element: HTMLElement,
  options: SplitOptions = {}
): SplitResult {
  const {
    type = 'chars,words',
    linesClass = 'split-line',
    wordsClass = 'split-word',
    charsClass = 'split-char',
  } = options

  const types = type.split(',').map((t) => t.trim().toLowerCase())
  const doChars = types.includes('chars')
  const doWords = types.includes('words')
  const doLines = types.includes('lines')

  // Save original HTML for revert
  const originalHTML = element.innerHTML
  const text = element.textContent || ''

  const allChars: HTMLSpanElement[] = []
  const allWords: HTMLSpanElement[] = []
  const allLines: HTMLSpanElement[] = []

  // Clear and rebuild
  element.innerHTML = ''
  element.style.overflow = 'hidden'

  const rawWords = text.split(/(\s+)/)

  rawWords.forEach((segment) => {
    if (/^\s+$/.test(segment)) {
      // Whitespace — preserve as text node
      element.appendChild(document.createTextNode(segment))
      return
    }

    if (!segment) return

    const wordSpan = document.createElement('span')
    wordSpan.className = wordsClass
    wordSpan.style.display = 'inline-block'
    wordSpan.style.overflow = 'hidden'

    if (doChars) {
      // Split word into individual characters
      segment.split('').forEach((char) => {
        const charSpan = document.createElement('span')
        charSpan.className = charsClass
        charSpan.textContent = char
        charSpan.style.display = 'inline-block'
        charSpan.style.willChange = 'transform, opacity'
        wordSpan.appendChild(charSpan)
        allChars.push(charSpan)
      })
    } else {
      wordSpan.textContent = segment
    }

    if (doWords) {
      wordSpan.style.willChange = 'transform, opacity'
      allWords.push(wordSpan)
    }

    element.appendChild(wordSpan)
  })

  // Line detection (if requested) — group words into lines based on offsetTop
  if (doLines && allWords.length > 0) {
    let currentLine: HTMLSpanElement[] = []
    let currentTop = allWords[0].offsetTop

    const flushLine = () => {
      if (currentLine.length === 0) return
      const lineSpan = document.createElement('span')
      lineSpan.className = linesClass
      lineSpan.style.display = 'block'
      lineSpan.style.overflow = 'hidden'
      lineSpan.style.willChange = 'transform, opacity'

      // Insert before first word of this line
      const firstWord = currentLine[0]
      firstWord.parentNode?.insertBefore(lineSpan, firstWord)

      currentLine.forEach((w) => lineSpan.appendChild(w))
      allLines.push(lineSpan)
    }

    allWords.forEach((word) => {
      if (Math.abs(word.offsetTop - currentTop) > 2) {
        flushLine()
        currentLine = []
        currentTop = word.offsetTop
      }
      currentLine.push(word)
    })
    flushLine()
  }

  const revert = () => {
    element.innerHTML = originalHTML
    element.style.overflow = ''
  }

  return { chars: allChars, words: allWords, lines: allLines, revert }
}
