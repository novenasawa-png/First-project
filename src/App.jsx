import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import SplitText from './components/reactbits/SplitText.jsx'
import ScrollReveal from './components/reactbits/ScrollReveal.jsx'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Change the phone number here; every Call button uses it.
const PHONE_DISPLAY = '(702) 238-4565'
const PHONE_LINK = 'tel:+17022384565'
const YEAR = new Date().getFullYear()

const WORK = [
  { src: '/media/live-feed.jpg', title: 'Live camera feed on the sales floor', place: 'Griswold Market & Meals' },
  { src: '/media/ceiling-cameras.jpg', title: 'Dome cameras over every aisle', place: 'Griswold Market & Meals' },
  { src: '/media/aisles.jpg', title: 'Full coverage, front to back', place: 'Griswold Market & Meals' },
  { src: '/media/kitchen.jpg', title: 'Kitchen and counter covered', place: 'Griswold Kitchen' },
]

const STEPS = [
  { n: '01', title: 'Call or text', body: 'Tell us what you want to protect: your home, store, restaurant or lot.' },
  { n: '02', title: 'Free on-site quote', body: 'We walk the property, find the blind spots and give you a clear price.' },
  { n: '03', title: 'Professional install', body: 'HD cameras mounted, wired and set up, with a live view ready when we leave.' },
]

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

function CallButton({ className = '', children = 'Call Now' }) {
  return (
    <a className={`call-btn ${className}`} href={PHONE_LINK}>
      <span className="call-dot" aria-hidden="true" />
      {children}
    </a>
  )
}

function AdVideo() {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)

  const toggleSound = () => {
    const v = videoRef.current
    v.muted = !v.muted
    if (!v.muted) {
      v.currentTime = 0
      v.play()
    }
    setMuted(v.muted)
  }

  return (
    <div className="ad-frame">
      <video ref={videoRef} src="/media/clear-cam-ad.mp4" poster="/media/ad-poster.jpg" autoPlay muted loop playsInline />
      <button className="sound-btn" onClick={toggleSound}>
        {muted ? '🔊 Tap for sound' : '🔇 Mute'}
      </button>
    </div>
  )
}

export default function App() {
  useLenis()
  const root = useRef(null)

  useGSAP(
    () => {
      gsap.from('.hero-logo', { scale: 0.6, opacity: 0, duration: 1.1, ease: 'back.out(1.6)' })
      gsap.from('.hero-sub, .hero .call-btn, .hero-note', { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, delay: 0.9, ease: 'power3.out' })

      // Hero background drifts and darkens as you scroll away
      gsap.to('.hero-bg', { yPercent: 25, scale: 1.1, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })

      gsap.from('.ad-frame', { y: 120, rotate: -4, opacity: 0, ease: 'power3.out', scrollTrigger: { trigger: '.ad-section', start: 'top 80%', end: 'top 30%', scrub: 1 } })

      gsap.utils.toArray('.work-card').forEach((card, i) => {
        gsap.from(card, { y: 80, opacity: 0, duration: 0.9, ease: 'power3.out', delay: (i % 2) * 0.12, scrollTrigger: { trigger: card, start: 'top 88%' } })
        gsap.fromTo(card.querySelector('img'), { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: card, scrub: true } })
      })

      gsap.from('.step', { x: -60, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.steps', start: 'top 80%' } })

      // Scanning line sweeps across the final call-to-action like a camera view
      gsap.fromTo('.scan-line', { yPercent: -100 }, { yPercent: 1100, duration: 3.2, repeat: -1, ease: 'none' })
    },
    { scope: root },
  )

  return (
    <main ref={root}>
      <section className="hero">
        <video className="hero-bg" src="/media/hero-loop.mp4" poster="/media/hero-poster.jpg" autoPlay muted loop playsInline aria-hidden="true" />
        <div className="hero-shade" />
        <div className="hero-content">
          <img className="hero-logo" src="/media/logo.png" alt="Clear Cam Security" />
          <SplitText text="See everything. Stop anything." tag="h1" className="hero-title" splitType="words" delay={90} />
          <p className="hero-sub">HD security cameras, professionally installed in Troy and nearby. Homes, stores and restaurants.</p>
          <CallButton>Call for a Free Quote</CallButton>
          <p className="hero-note">Free on-site quote · Local installers</p>
        </div>
      </section>

      <section className="ad-section">
        <div className="ad-copy">
          <p className="eyebrow">You've seen our work</p>
          <h2>That live camera feed at your local store? <span className="accent">We installed that.</span></h2>
          <p className="muted">Watch our 30-second spot.</p>
        </div>
        <AdVideo />
      </section>

      <section className="statement">
        <ScrollReveal textClassName="reveal-text">
          Stores, restaurants and homes across Troy trust Clear Cam Security to keep watch, so they don't have to.
        </ScrollReveal>
      </section>

      <section className="work">
        <p className="eyebrow">Recent install</p>
        <h2>Griswold Market & Meals</h2>
        <div className="work-grid">
          {WORK.map(w => (
            <figure className="work-card" key={w.src}>
              <div className="work-img">
                <img src={w.src} alt={w.title} loading="lazy" />
              </div>
              <figcaption>
                <strong>{w.title}</strong>
                <span>{w.place}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="how">
        <p className="eyebrow">How it works</p>
        <h2>Protected in three steps</h2>
        <ol className="steps">
          {STEPS.map(s => (
            <li className="step" key={s.n}>
              <span className="step-n">{s.n}</span>
              <div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="final-cta">
        <div className="cta-box">
          <div className="scan-line" aria-hidden="true" />
          <span className="rec">● REC</span>
          <h2>Protect it before something happens.</h2>
          <p className="muted">Free on-site quote in Troy and nearby.</p>
          <CallButton className="big">Call {PHONE_DISPLAY}</CallButton>
        </div>
        <footer>© {YEAR} Clear Cam Security · Troy, Michigan · Ad voiceover is AI-generated.</footer>
      </section>

      <CallButton className="sticky-call">Call Now · Free Quote</CallButton>
    </main>
  )
}
