import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PondScene from '../components/PondScene'
import PageWrapper from '../components/PageWrapper'
import { useAudio } from '../hooks/useAudio'
import { siteData } from '../data/siteData'

export default function Home() {
  const [entered, setEntered] = useState(false)
  const { play, hasInteracted } = useAudio()

  const handleEnter = () => {
    setEntered(true)
    // Try home track first, fallback to ambient
    const track = siteData.audioTracks.home
    play(track.fallbackUrl, track.label)
  }

  return (
    <PageWrapper style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Full screen pond scene */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <PondScene />
      </div>

      {/* Vignette overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at center, transparent 40%, rgba(6,10,20,0.6) 100%),
            linear-gradient(to bottom, rgba(6,10,20,0.2) 0%, transparent 15%, transparent 85%, rgba(6,10,20,0.8) 100%)
          `,
        }}
      />

      {/* Content overlay */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <AnimatePresence mode="wait">
          {!entered ? (
            <motion.div
              key="gate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5, duration: 1.5 } }}
              exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.8 } }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
              }}
            >
              {/* Torii gate SVG */}
              <motion.svg
                width="80"
                height="60"
                viewBox="0 0 80 60"
                fill="none"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 1.2 } }}
              >
                <rect x="8" y="4" width="64" height="6" rx="1" fill="var(--gold)" opacity="0.9" />
                <rect x="4" y="0" width="72" height="4" rx="1" fill="var(--gold)" />
                <rect x="14" y="10" width="5" height="50" fill="var(--gold)" opacity="0.7" />
                <rect x="61" y="10" width="5" height="50" fill="var(--gold)" opacity="0.7" />
                <rect x="12" y="22" width="56" height="3" rx="1" fill="var(--gold)" opacity="0.4" />
              </motion.svg>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 1, duration: 1 } }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                  fontWeight: 400,
                  color: 'var(--gold)',
                  letterSpacing: '0.12em',
                  textShadow: '0 2px 20px rgba(201, 168, 76, 0.3), 0 0 60px rgba(201, 168, 76, 0.1)',
                  lineHeight: 1.2,
                }}
              >
                Two Drifters
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.4, duration: 1 } }}
                style={{
                  fontFamily: 'var(--font-accent)',
                  fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.15em',
                  fontWeight: 300,
                  fontStyle: 'italic',
                }}
              >
                {siteData.tagline}
              </motion.p>

              <motion.button
                className="jade-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 2, duration: 0.8 } }}
                onClick={handleEnter}
                style={{ marginTop: '1rem', fontSize: '1rem', padding: '1rem 2.5rem' }}
              >
                Enter the Garden
              </motion.button>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4, transition: { delay: 2.5, duration: 1 } }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.5rem',
                }}
              >
                Best experienced with sound
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 1.2, delay: 0.3 } }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                maxWidth: '700px',
              }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1, transition: { delay: 0.6, duration: 0.8 } }}
                style={{
                  width: '60px',
                  height: '1px',
                  background: 'var(--gold)',
                }}
              />

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.8 } }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                  color: 'var(--gold)',
                  fontWeight: 400,
                  letterSpacing: '0.06em',
                  textShadow: '0 2px 15px rgba(201, 168, 76, 0.2)',
                }}
              >
                Welcome to Our Museum
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.2, duration: 1 } }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  color: 'var(--text-secondary)',
                  textAlign: 'center',
                  lineHeight: 1.8,
                  fontWeight: 300,
                }}
              >
                {siteData.couple.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 1.8, duration: 0.8 } }}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  justifyContent: 'center',
                  marginTop: '1rem',
                }}
              >
                <Link to="/journey" className="jade-btn">
                  Explore the Journey
                </Link>
                <Link to="/temple-of-children" className="jade-btn" style={{ background: 'linear-gradient(145deg, #1a5c3c 0%, #134a30 40%, #0f3d26 70%, #1a5c3c 100%)' }}>
                  Temple of the Children
                </Link>
                <Link to="/temple-of-ancestors" className="jade-btn" style={{ background: 'linear-gradient(145deg, #2a4a6e 0%, #1c3654 40%, #152a42 70%, #1c3654 100%)' }}>
                  Temple of the Ancestors
                </Link>
              </motion.div>

              {/* Gemini symbol */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5, transition: { delay: 2.2, duration: 1 } }}
                style={{
                  marginTop: '2rem',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                  color: 'var(--gold-dim)',
                  letterSpacing: '0.2em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{'\u264A'}</span>
                Born under the Twins
                <span style={{ fontSize: '1.2rem' }}>{'\u264A'}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll indicator (after entered) */}
      {entered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4, transition: { delay: 3, duration: 1 } }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
            EXPLORE
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{
              width: '1px',
              height: '20px',
              background: 'linear-gradient(to bottom, var(--gold-dim), transparent)',
            }}
          />
        </motion.div>
      )}
    </PageWrapper>
  )
}
