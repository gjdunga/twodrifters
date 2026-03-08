import { useEffect } from 'react'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { useAudio } from '../hooks/useAudio'
import { siteData } from '../data/siteData'

const fadeUp = {
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function TempleAncestors() {
  const { play } = useAudio()

  useEffect(() => {
    const tracks = siteData.audioTracks.ambient
    const track = tracks[Math.floor(Math.random() * tracks.length)]
    play(track.url)
  }, [play])

  return (
    <PageWrapper>
      <div
        style={{
          minHeight: '100vh',
          paddingTop: '120px',
          paddingBottom: '4rem',
          background: `
            radial-gradient(ellipse at 50% 20%, rgba(201, 168, 76, 0.06), transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(22, 45, 74, 0.3), transparent 60%),
            var(--night-deep)
          `,
        }}
      >
        <div className="container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              color: 'var(--gold-dim)',
              letterSpacing: '0.3em',
              marginBottom: '0.75rem',
            }}>
              {'\u7956'} TEMPLE OF THE ANCESTORS {'\u7956'}
            </p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1, transition: { delay: 0.3, duration: 0.8 } }}
              style={{
                width: '80px',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                margin: '0 auto 1.5rem',
                borderRadius: '2px',
              }}
            />

            <h1 style={{ marginBottom: '1rem' }}>
              Those Who Came Before
            </h1>
            <p style={{
              maxWidth: '600px',
              margin: '0 auto',
              textAlign: 'center',
              fontSize: '1.05rem',
              lineHeight: 1.8,
            }}>
              In the quiet of the temple, we honor those whose footsteps made our
              own possible. Their strength, their sacrifices, and their love echo
              through every generation.
            </p>
          </motion.div>

          <div className="section-divider" />

          {/* Ancestral shrine */}
          <motion.div
            style={{
              maxWidth: '800px',
              margin: '3rem auto',
              padding: '3rem 2rem',
              background: `
                linear-gradient(135deg, rgba(201, 168, 76, 0.03), rgba(255,255,255,0.01)),
                rgba(6, 10, 20, 0.6)
              `,
              borderRadius: '20px',
              border: '1px solid rgba(201, 168, 76, 0.12)',
              position: 'relative',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.3 } }}
          >
            {/* Decorative corner elements */}
            <div style={cornerStyle('top', 'left')} />
            <div style={cornerStyle('top', 'right')} />
            <div style={cornerStyle('bottom', 'left')} />
            <div style={cornerStyle('bottom', 'right')} />

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                  filter: 'drop-shadow(0 0 8px rgba(201, 168, 76, 0.3))',
                }}
              >
                {'\u{1F56F}\uFE0F'}
              </motion.div>

              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                The Eternal Flame
              </h2>

              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.9,
                fontStyle: 'italic',
                maxWidth: '500px',
                margin: '0 auto',
              }}>
                This space is dedicated to the memory of family members
                who have passed into the next world. Their stories live on
                in the hearts of those they loved.
              </p>
            </div>

            <div className="section-divider" style={{ maxWidth: '100px' }} />

            {/* Memorial plaques (placeholder) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem',
            }}>
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  style={{
                    padding: '1.5rem',
                    background: 'rgba(201, 168, 76, 0.02)',
                    borderRadius: '12px',
                    border: '1px solid rgba(201, 168, 76, 0.08)',
                    textAlign: 'center',
                    minHeight: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '1px solid rgba(201, 168, 76, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(201, 168, 76, 0.03)',
                  }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gold-dim)', fontFamily: 'var(--font-display)' }}>
                      {'\u{1F5BC}\uFE0F'}
                    </span>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                  }}>
                    In Memoriam
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    opacity: 0.5,
                  }}>
                    Details coming soon
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Offering section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, transition: { duration: 1, delay: 0.3 } }}
            viewport={{ once: true }}
            style={{
              textAlign: 'center',
              marginTop: '4rem',
              padding: '2rem',
            }}
          >
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
              Leave an Offering
            </h3>
            <p style={{
              maxWidth: '450px',
              margin: '0 auto 1.5rem',
              fontSize: '0.9rem',
              textAlign: 'center',
            }}>
              Share a memory, a prayer, or a word of gratitude for those
              who paved the way.
            </p>

            <div style={{
              maxWidth: '500px',
              margin: '0 auto',
            }}>
              <textarea
                placeholder="Write your offering here..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(201, 168, 76, 0.15)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(201, 168, 76, 0.35)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(201, 168, 76, 0.15)'}
              />
              <button
                className="jade-btn"
                style={{ marginTop: '1rem' }}
                onClick={() => alert('Thank you for your offering. It has been received.')}
              >
                Place Offering
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}

function cornerStyle(vPos, hPos) {
  const size = '24px'
  return {
    position: 'absolute',
    [vPos]: '12px',
    [hPos]: '12px',
    width: size,
    height: size,
    borderColor: 'var(--gold-dim)',
    borderStyle: 'solid',
    borderWidth: 0,
    [`border${vPos === 'top' ? 'Top' : 'Bottom'}Width`]: '1px',
    [`border${hPos === 'left' ? 'Left' : 'Right'}Width`]: '1px',
    opacity: 0.4,
  }
}
