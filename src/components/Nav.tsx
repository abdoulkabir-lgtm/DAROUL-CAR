'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <Link href="/" className="logo" aria-label="DAROUL CAR — accueil">
        <img src="/logo.png" alt="DAROUL CAR" />
      </Link>
      <div className="links">
        <Link href="/#accueil">Showroom</Link>
        <Link href="/#collection">Collection</Link>
        <Link href="/#demande" className="keep">Demande d’achat</Link>
      </div>
    </nav>
  )
}
