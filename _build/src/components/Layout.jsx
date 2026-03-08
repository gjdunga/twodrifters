import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AudioProvider, useAudio } from '../hooks/useAudio'

const navLinks = [
  { path: '/', label: 'Home', jp: '\u5BB6' },
  { path: '/journey', label: 'The Journey', jp: '\u65C5' },
  { path: '/temple-of-children', label: 'Temple of the Children', jp: '\u5B50' },
  { path: '/temple-of-ancestors', label: 'Temple of the Ancestors', jp: '\u7956' },
  { path: '/contact', label: 'Contact', jp: '\u7E01' },
]

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = location.pathname === '/'

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '0.6rem 0' : '1rem 0',
        background: scrolled
          ? 'rgba(6, 10, 20, 0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(201, 168, 76, 0.15)'
          : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      <div
        style={{
          width: '92%',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo / Brand */}
        <Link
          to="/"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            textDecoration: 'none',
          }}
        >
          <ToriiIcon />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.7rem',
              color: 'var(--gold)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Two Drifters
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                color:
                  location.pathname === link.path
                    ? 'var(--gold-bright)'
                    : 'var(--text-secondary)',
                letterSpacing: '0.08em',
                transition: 'color 0.3s',
                position: 'relative',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontSize: '0.55rem', display: 'block', textAlign: 'center', color: 'var(--gold-dim)', marginBottom: '2px' }}>
                {link.jp}
              </span>
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '25%',
                    right: '25%',
                    height: '2px',
                    background: 'var(--gold)',
                    borderRadius: '1px',
                  }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            flexDirection: 'column',
            gap: '5px',
          }}
          aria-label="Toggle menu"
        >
          <span style={{
            display: 'block',
            width: '24px',
            height: '1.5px',
            background: 'var(--gold)',
            transition: 'all 0.3s',
            transform: isOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none',
          }} />
          <span style={{
            display: 'block',
            width: '24px',
            height: '1.5px',
            background: 'var(--gold)',
            transition: 'all 0.3s',
            opacity: isOpen ? 0 : 1,
          }} />
          <span style={{
            display: 'block',
            width: '24px',
            height: '1.5px',
            background: 'var(--gold)',
            transition: 'all 0.3s',
            transform: isOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none',
          }} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(6, 10, 20, 0.97)',
              borderTop: '1px solid rgba(201, 168, 76, 0.15)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    color: location.pathname === link.path ? 'var(--gold-bright)' : 'var(--text-secondary)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: location.pathname === link.path ? 'rgba(201, 168, 76, 0.08)' : 'transparent',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: 'var(--gold-dim)' }}>{link.jp}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}

function AudioControl() {
  const { isPlaying, toggle } = useAudio()

  return (
    <button className="audio-control" onClick={toggle} aria-label="Toggle music">
      {isPlaying ? (
        <svg viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
      )}
    </button>
  )
}

function ToriiIcon() {
  return (
    <svg
      width="28"
      height="24"
      viewBox="0 0 28 24"
      fill="none"
      style={{ filter: 'drop-shadow(0 0 4px rgba(201, 168, 76, 0.3))' }}
    >
      <rect x="4" y="2" width="20" height="2.5" rx="0.5" fill="var(--gold)" />
      <rect x="2" y="0" width="24" height="2" rx="0.5" fill="var(--gold)" />
      <rect x="6" y="4.5" width="2" height="19" fill="var(--gold)" opacity="0.8" />
      <rect x="20" y="4.5" width="2" height="19" fill="var(--gold)" opacity="0.8" />
      <rect x="5" y="9" width="18" height="1.5" rx="0.5" fill="var(--gold)" opacity="0.5" />
    </svg>
  )
}

export default function Layout({ children }) {
  return (
    <AudioProvider>
      <Navigation />
      <main style={{ minHeight: '100vh' }}>
        {children}
      </main>
      <AudioControl />

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          padding: '3rem 1rem 2rem',
          borderTop: '1px solid rgba(201, 168, 76, 0.1)',
          background: 'linear-gradient(to top, rgba(6,10,20,1), transparent)',
        }}
      >
        <ToriiIcon />
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginTop: '0.75rem',
            letterSpacing: '0.1em',
          }}
        >
          Two Drifters &middot; A Life in Motion
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            marginTop: '0.5rem',
            opacity: 0.6,
          }}
        >
          &copy; {new Date().getFullYear()} Pat & Jack
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            marginTop: '0.4rem',
            opacity: 0.5,
          }}
        >
          Another Wonderful Creation by{' '}
          <a
            href="https://dstaftn.net"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gold-dim)', textDecoration: 'none' }}
          >
            DunganSoft Technologies
          </a>
        </p>
      </footer>
    </AudioProvider>
  )
}
