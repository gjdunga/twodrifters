import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { useAudio } from '../hooks/useAudio'
import { siteData } from '../data/siteData'

export default function Contact() {
  const { play } = useAudio()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const tracks = siteData.audioTracks.ambient
    const track = tracks[Math.floor(Math.random() * tracks.length)]
    play(track.url, track.label)
  }, [play])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setStatus(null)

    try {
      const res = await fetch('/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
    setSending(false)
  }

  return (
    <PageWrapper>
      <div
        style={{
          minHeight: '100vh',
          paddingTop: '120px',
          paddingBottom: '4rem',
          background: `
            radial-gradient(ellipse at 60% 20%, rgba(45, 138, 94, 0.06), transparent 50%),
            var(--night-deep)
          `,
        }}
      >
        <div className="container">
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
              {'\u7E01'} CONTACT {'\u7E01'}
            </p>

            <h1 style={{ marginBottom: '1rem' }}>
              Leave a Message
            </h1>
            <p style={{
              maxWidth: '500px',
              margin: '0 auto',
              textAlign: 'center',
              fontSize: '1.05rem',
              lineHeight: 1.8,
            }}>
              Like a stone placed at the temple gate, your words are welcome here.
              Reach out to Pat and Jack.
            </p>
          </motion.div>

          <div className="section-divider" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.8 } }}
            style={{
              maxWidth: '600px',
              margin: '3rem auto 0',
              padding: '2.5rem 2rem',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '20px',
              border: '1px solid rgba(201, 168, 76, 0.1)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="Enter your name"
                  onFocus={(e) => e.target.style.borderColor = 'rgba(45, 138, 94, 0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(201, 168, 76, 0.15)'}
                />
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  placeholder="your@email.com"
                  onFocus={(e) => e.target.style.borderColor = 'rgba(45, 138, 94, 0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(201, 168, 76, 0.15)'}
                />
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  style={inputStyle}
                  placeholder="What brings you to our garden?"
                  onFocus={(e) => e.target.style.borderColor = 'rgba(45, 138, 94, 0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(201, 168, 76, 0.15)'}
                />
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Your Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                  placeholder="Share your thoughts, memories, or words of connection..."
                  onFocus={(e) => e.target.style.borderColor = 'rgba(45, 138, 94, 0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(201, 168, 76, 0.15)'}
                />
              </div>

              <button
                className="jade-btn"
                onClick={handleSubmit}
                disabled={sending || !form.name || !form.email || !form.message}
                style={{
                  alignSelf: 'center',
                  marginTop: '0.5rem',
                  opacity: sending ? 0.6 : 1,
                  cursor: sending ? 'wait' : 'pointer',
                }}
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    textAlign: 'center',
                    color: 'var(--jade-light)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9rem',
                  }}
                >
                  Your message has been received. Thank you.
                </motion.p>
              )}

              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    textAlign: 'center',
                    color: '#c0392b',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                  }}
                >
                  Something went wrong. Please try again or reach out directly.
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}

const fieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
}

const labelStyle = {
  fontFamily: 'var(--font-display)',
  fontSize: '0.8rem',
  color: 'var(--gold)',
  letterSpacing: '0.08em',
}

const inputStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(201, 168, 76, 0.15)',
  borderRadius: '10px',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.3s',
  lineHeight: 1.6,
}
