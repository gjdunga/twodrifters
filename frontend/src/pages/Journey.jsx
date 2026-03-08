import { useEffect } from 'react'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { useAudio } from '../hooks/useAudio'
import { siteData } from '../data/siteData'

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Journey() {
  const { play } = useAudio()

  useEffect(() => {
    const tracks = siteData.audioTracks.ambient
    const track = tracks[Math.floor(Math.random() * tracks.length)]
    play(track.url, track.label)
  }, [play])

  return (
    <PageWrapper>
      {/* Page background */}
      <div
        style={{
          minHeight: '100vh',
          paddingTop: '120px',
          paddingBottom: '4rem',
          background: `
            radial-gradient(ellipse at 20% 10%, rgba(22, 45, 74, 0.4), transparent 60%),
            radial-gradient(ellipse at 80% 90%, rgba(26, 92, 60, 0.15), transparent 60%),
            var(--night-deep)
          `,
        }}
      >
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            style={{ textAlign: 'center', marginBottom: '4rem' }}
          >
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              color: 'var(--gold-dim)',
              letterSpacing: '0.3em',
              marginBottom: '0.75rem',
            }}>
              {'\u65C5'} THE JOURNEY {'\u65C5'}
            </p>
            <h1 style={{ marginBottom: '1rem' }}>
              A Life in Motion
            </h1>
            <p style={{
              maxWidth: '600px',
              margin: '0 auto',
              textAlign: 'center',
              fontSize: '1.05rem',
              lineHeight: 1.8,
            }}>
              From the halls of service to the shores of distant lands,
              Pat and Jack have woven a tapestry of experiences that
              spans decades and continents.
            </p>
            <div className="section-divider" style={{ marginTop: '3rem' }} />
          </motion.div>

          {/* Pat & Jack Quick Bios */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginBottom: '4rem',
            }}
          >
            <motion.div variants={fadeUp} style={bioCardStyle}>
              <div style={bioIconStyle}>{'\u{1F3DB}\uFE0F'}</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Pat</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                Graduate of UT Arlington with a degree in Architecture.
                An eye trained to see beauty in structure, carried from
                blueprints to Buddhist temples.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {siteData.pat.passions.map((p, i) => (
                  <span key={i} style={tagStyle}>{p}</span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} style={bioCardStyle}>
              <div style={bioIconStyle}>{'\u{1FA96}'}</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Jack</h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                United States Marine Corps, VMFA-225 "The Vikings."
                Vietnam veteran. A spirit forged in service, softened by
                decades of discovery.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {siteData.jack.passions.map((p, i) => (
                  <span key={i} style={tagStyle}>{p}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <div className="section-divider" />

          {/* Journey Timeline */}
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
            style={{ marginTop: '3rem' }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
              Chapters of Adventure
            </h2>

            <div style={{ position: 'relative' }}>
              {/* Timeline line */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  background: 'linear-gradient(to bottom, transparent, var(--gold-dim), transparent)',
                  display: 'var(--timeline-line-display, block)',
                }}
                className="timeline-line"
              />

              {siteData.journeys.map((journey, idx) => (
                <motion.div
                  key={journey.id}
                  variants={fadeUp}
                  whileInView="animate"
                  initial="initial"
                  viewport={{ once: true, margin: '-30px' }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 1fr',
                    gap: '2rem',
                    marginBottom: '3rem',
                    alignItems: 'start',
                  }}
                  className="timeline-item"
                >
                  {/* Left content or spacer */}
                  <div style={{
                    textAlign: idx % 2 === 0 ? 'right' : 'left',
                    order: idx % 2 === 0 ? 0 : 2,
                  }}>
                    {idx % 2 === 0 && <JourneyCard journey={journey} align="right" />}
                  </div>

                  {/* Center dot */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: '1.5rem',
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: 'var(--jade)',
                      border: '2px solid var(--gold-dim)',
                      boxShadow: '0 0 12px var(--jade-glow)',
                      flexShrink: 0,
                    }} />
                  </div>

                  {/* Right content or spacer */}
                  <div style={{
                    textAlign: idx % 2 === 0 ? 'left' : 'right',
                    order: idx % 2 === 0 ? 2 : 0,
                  }}>
                    {idx % 2 !== 0 && <JourneyCard journey={journey} align="left" />}
                    {idx % 2 === 0 && <div />}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .timeline-line { display: none !important; }
          .timeline-item {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
          }
          .timeline-item > div:nth-child(2) { display: none; }
          .timeline-item > div { text-align: left !important; order: 0 !important; }
        }
      `}</style>
    </PageWrapper>
  )
}

function JourneyCard({ journey, align }) {
  return (
    <div
      style={{
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '12px',
        border: '1px solid rgba(201, 168, 76, 0.1)',
        backdropFilter: 'blur(4px)',
        transition: 'all 0.3s',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.25)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(201, 168, 76, 0.1)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{journey.icon}</div>
      <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{journey.title}</h3>
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.75rem',
        color: 'var(--jade-light)',
        letterSpacing: '0.1em',
        marginBottom: '0.75rem',
      }}>
        {journey.location} &middot; {journey.period}
      </p>
      <p style={{ fontSize: '0.9rem', lineHeight: 1.7, textAlign: align === 'right' ? 'right' : 'left' }}>
        {journey.description}
      </p>
    </div>
  )
}

const bioCardStyle = {
  padding: '2rem',
  background: 'rgba(255,255,255,0.02)',
  borderRadius: '16px',
  border: '1px solid rgba(201, 168, 76, 0.12)',
  backdropFilter: 'blur(4px)',
}

const bioIconStyle = {
  fontSize: '2rem',
  marginBottom: '0.75rem',
}

const tagStyle = {
  fontFamily: 'var(--font-body)',
  fontSize: '0.7rem',
  color: 'var(--jade-light)',
  background: 'rgba(45, 138, 94, 0.1)',
  border: '1px solid rgba(45, 138, 94, 0.2)',
  borderRadius: '20px',
  padding: '0.2rem 0.65rem',
  letterSpacing: '0.04em',
}
