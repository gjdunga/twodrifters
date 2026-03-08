import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'

const AudioCtx = createContext(null)

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  const isPlayingRef = useRef(false)
  const currentTrackRef = useRef(null)

  useEffect(() => {
    const el = new Audio()
    el.loop = true
    el.volume = 0.3
    el.preload = 'auto'
    audioRef.current = el

    const syncPlay = () => {
      isPlayingRef.current = true
      setIsPlaying(true)
    }
    const syncPause = () => {
      isPlayingRef.current = false
      setIsPlaying(false)
    }
    const onError = () => {
      console.error('Audio error:', el.error?.message, 'src:', el.src)
    }

    el.addEventListener('play', syncPlay)
    el.addEventListener('pause', syncPause)
    el.addEventListener('error', onError)

    return () => {
      el.removeEventListener('play', syncPlay)
      el.removeEventListener('pause', syncPause)
      el.removeEventListener('error', onError)
      el.pause()
      el.removeAttribute('src')
      el.load()
      if (fadeRef.current) clearInterval(fadeRef.current)
    }
  }, [])

  const clearFade = useCallback(() => {
    if (fadeRef.current) {
      clearInterval(fadeRef.current)
      fadeRef.current = null
    }
  }, [])

  const fadeTo = useCallback((target, duration = 1500) => {
    const el = audioRef.current
    if (!el) return
    clearFade()
    const steps = 30
    const stepTime = duration / steps
    const startVol = el.volume
    const delta = (target - startVol) / steps
    let step = 0

    fadeRef.current = setInterval(() => {
      step++
      const vol = Math.max(0, Math.min(1, startVol + delta * step))
      try { el.volume = vol } catch {}
      if (step >= steps) {
        try { el.volume = target } catch {}
        clearFade()
        if (target === 0) el.pause()
      }
    }, stepTime)
  }, [clearFade])

  // SYNCHRONOUS play: no async boundary before el.play()
  // preserves user gesture context in all browsers.
  //
  // Safe to call from useEffect too: if play fails (no gesture),
  // current audio keeps running because we only switch src after
  // confirming we can play. For non-gesture calls when nothing
  // is currently playing, audio just stays silent until the user
  // clicks the toggle button.
  const play = useCallback((url, fallbackUrl) => {
    const el = audioRef.current
    if (!el || !url) return

    // Already playing this track: no-op
    if (currentTrackRef.current === url && isPlayingRef.current) return

    // Save current state so we can restore on failure
    const prevSrc = currentTrackRef.current
    const wasPlaying = isPlayingRef.current
    const prevVolume = el.volume

    // Set new source (this stops current playback internally)
    el.src = url
    el.volume = wasPlaying ? 0.15 : 0.3

    const onSuccess = () => {
      currentTrackRef.current = url
      setCurrentTrack(url)
      fadeTo(0.4, 2000)
    }

    const onFail = (err, triedUrl) => {
      console.warn('Audio play failed for:', triedUrl, err.message)
      // Restore previous track if we had one playing
      if (wasPlaying && prevSrc) {
        el.src = prevSrc
        el.volume = prevVolume
        currentTrackRef.current = prevSrc
        setCurrentTrack(prevSrc)
        // Resume previous track (should succeed since browser already allowed it)
        const p = el.play()
        if (p) p.catch(() => {})
      }
    }

    const playPromise = el.play()
    if (playPromise !== undefined) {
      playPromise
        .then(onSuccess)
        .catch((err) => {
          // Try fallback before restoring
          if (fallbackUrl && fallbackUrl !== url) {
            el.src = fallbackUrl
            el.volume = wasPlaying ? 0.15 : 0.3
            const fbPromise = el.play()
            if (fbPromise !== undefined) {
              fbPromise
                .then(() => {
                  currentTrackRef.current = fallbackUrl
                  setCurrentTrack(fallbackUrl)
                  fadeTo(0.4, 2000)
                })
                .catch((err2) => onFail(err2, fallbackUrl))
            }
          } else {
            onFail(err, url)
          }
        })
    }
  }, [fadeTo])

  // Toggle: mute/unmute with fade
  const toggle = useCallback(() => {
    const el = audioRef.current
    if (!el) return

    if (isPlayingRef.current) {
      fadeTo(0, 600)
    } else if (el.src && el.src !== window.location.href) {
      el.volume = 0.15
      const p = el.play()
      if (p !== undefined) {
        p.then(() => fadeTo(0.4, 1000))
         .catch((err) => console.warn('Toggle resume failed:', err.message))
      }
    }
  }, [fadeTo])

  return (
    <AudioCtx.Provider value={{ isPlaying, currentTrack, play, toggle }}>
      {children}
    </AudioCtx.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be inside AudioProvider')
  return ctx
}
