import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SplitText from './components/reactbits/SplitText.jsx'
import ScrollReveal from './components/reactbits/ScrollReveal.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Smooth scrolling with Lenis, driven by GSAP's ticker so ScrollTrigger stays in sync
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    const tick = time => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])
}

export default function App() {
  useLenis()
  const boxRef = useRef(null)

  useGSAP(() => {
    gsap.to(boxRef.current, {
      rotation: 360,
      x: 200,
      scrollTrigger: { trigger: boxRef.current, start: 'top 80%', end: 'top 20%', scrub: true },
    })
  })

  return (
    <main>
      <section>
        <div>
          <SplitText text="First Project" tag="h1" className="hero-title" />
          <p className="hint">GSAP + Lenis + React Bits. Scroll down.</p>
        </div>
      </section>

      <section>
        <div ref={boxRef} className="box" />
      </section>

      <section>
        <ScrollReveal textClassName="reveal-text">
          Smooth scrolling from Lenis, animation from GSAP, and text effects from React Bits.
        </ScrollReveal>
      </section>
    </main>
  )
}
