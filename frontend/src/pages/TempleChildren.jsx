import { useEffect } from 'react'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { useAudio } from '../hooks/useAudio'
import { siteData } from '../data/siteData'

const stagger = {
  animate: { transition: { staggerChildren: 0.2 } },
}
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function TempleChildren() {
  const { play } = useAudio()

  useEffect(() => {
    const tracks = siteData.audioTracks.ambient
    const track = tracks[Math.floor(Math.random() * tracks.length)]
    play(track.url, track.label)
  }, [play])

  return (
    <PageWrapper>
      <div
        style={{
          minHeight: '100vh',
          paddingTop: '120px',
          paddingBottom: '4rem',
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(45, 138, 94, 0.08), transparent 60%),
            radial-gradient(ellipse at 30% 80%, rgba(201, 168, 76, 0.04), transparent 50%),
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
              color: 'var(--jade-light)',
              letterSpacing: '0.3em',
              marginBottom: '0.75rem',
            }}>
              {'\u5B50'} TEMPLE OF THE CHILDREN {'\u5B50'}
            </p>

            {/* Decorative torii */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1, transition: { delay: 0.3, duration: 0.8 } }}
              style={{
                width: '80px',
                height: '3px',
                background: 'linear-gradient(90deg, transparent, var(--jade), transparent)',
                margin: '0 auto 1.5rem',
                borderRadius: '2px',
              }}
            />

            <h1 style={{ marginBottom: '1rem' }}>
              The Next Generation
            </h1>
            <p style={{
              maxWidth: '550px',
              margin: '0 auto',
              textAlign: 'center',
              fontSize: '1.05rem',
              lineHeight: 1.8,
            }}>
              Every great journey leaves seeds along the path. The children
              of Pat and Jack carry forward the spirit of adventure, service,
              and curiosity that has defined their parents' lives.
            </p>
          </motion.div>

          <div className="section-divider" />

          {/* Shrine area: placeholder cards for children */}
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginTop: '3rem',
              maxWidth: '900px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {[
              {
                label: 'The First Light',
                text: 'Every family begins with a single step into the unknown. The eldest carries the weight and wonder of being first.',
                icon: '\u{1F33F}',
              },
              {
                label: 'The Middle Path',
                text: 'Between the first and last, a bridge is built. The middle child learns the art of harmony, of holding opposites together.',
                icon: '\u{1F343}',
              },
              {
                label: 'The Youngest Bloom',
                text: 'The last to arrive often carries the lightest heart and the keenest eye, seeing the world through laughter.',
                icon: '\u{1F338}',
              },
            ].map((child, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                style={shrineCardStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(45, 138, 94, 0.3)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(45, 138, 94, 0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Shrine lamp */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(45, 138, 94, 0.3), rgba(45, 138, 94, 0.05))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  margin: '0 auto 1rem',
                  boxShadow: '0 0 20px rgba(45, 138, 94, 0.15)',
                }}>
                  {child.icon}
                </div>

                <h3 style={{
                  textAlign: 'center',
                  fontSize: '1.15rem',
                  marginBottom: '0.75rem',
                }}>
                  {child.label}
                </h3>

                <p style={{
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  lineHeight: 1.8,
                  fontStyle: 'italic',
                }}>
                  {child.text}
                </p>

                {/* Placeholder photo area */}
                <div style={{
                  marginTop: '1.25rem',
                  height: '160px',
                  borderRadius: '8px',
                  background: `
                    linear-gradient(135deg, rgba(45, 138, 94, 0.05), rgba(201, 168, 76, 0.03)),
                    repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 10px,
                      rgba(255,255,255,0.01) 10px,
                      rgba(255,255,255,0.01) 20px
                    )
                  `,
                  border: '1px dashed rgba(201, 168, 76, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.5rem', opacity: 0.3 }}>{'\u{1F5BC}\uFE0F'}</span>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.1em',
                  }}>
                    Photo Coming Soon
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, transition: { duration: 1, delay: 0.5 } }}
            viewport={{ once: true }}
            style={{
              textAlign: 'center',
              marginTop: '4rem',
              padding: '2rem',
            }}
          >
            <div className="section-divider" />
            <p style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: 'var(--gold)',
              fontStyle: 'italic',
              marginTop: '2rem',
              lineHeight: 1.8,
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              "The greatest adventure is not the places you go,
              but the lives you leave behind."
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}

const shrineCardStyle = {
  padding: '2rem 1.5rem',
  background: 'rgba(255,255,255,0.02)',
  borderRadius: '16px',
  border: '1px solid rgba(45, 138, 94, 0.1)',
  backdropFilter: 'blur(4px)',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  cursor: 'default',
}
