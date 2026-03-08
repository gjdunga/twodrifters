import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'

const AudioCtx = createContext(null)

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  // Refs mirror state so callbacks never read stale closures
  const isPlayingRef = useRef(false)
  const currentTrackRef = useRef(null)

  useEffect(() => {
    const el = new Audio()
    el.loop = true
    el.volume = 0
    el.preload = 'auto'
    audioRef.current = el

    // Sync state from native events (covers edge cases like browser pause)
    const onPlay = () => {
      isPlayingRef.current = true
      setIsPlaying(true)
    }
    const onPause = () => {
      isPlayingRef.current = false
      setIsPlaying(false)
    }
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)

    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.pause()
      el.src = ''
      if (fadeRef.current) clearInterval(fadeRef.current)
    }
  }, [])

  const clearFade = useCallback(() => {
    if (fadeRef.current) {
      clearInterval(fadeRef.current)
      fadeRef.current = null
    }
  }, [])

  const fadeIn = useCallback((target = 0.4, duration = 2000) => {
    const el = audioRef.current
    if (!el) return
    clearFade()
    const steps = 40
    const stepTime = duration / steps
    const increment = target / steps
    let vol = 0
    el.volume = 0

    fadeRef.current = setInterval(() => {
      vol = Math.min(vol + increment, target)
      try { el.volume = vol } catch {}
      if (vol >= target) clearFade()
    }, stepTime)
  }, [clearFade])

  const fadeOut = useCallback((duration = 800) => {
    return new Promise((resolve) => {
      const el = audioRef.current
      if (!el || el.paused || el.volume < 0.01) {
        resolve()
        return
      }
      clearFade()
      const steps = 20
      const stepTime = duration / steps
      const startVol = el.volume
      const decrement = startVol / steps
      let vol = startVol

      fadeRef.current = setInterval(() => {
        vol = Math.max(vol - decrement, 0)
        try { el.volume = vol } catch {}
        if (vol <= 0) {
          clearFade()
          el.pause()
          resolve()
        }
      }, stepTime)
    })
  }, [clearFade])

  // Play a URL. Tries primary, falls back to fallback on error.
  const play = useCallback(async (url, fallbackUrl) => {
    const el = audioRef.current
    if (!el || !url) return

    // Already playing this exact track: no-op
    if (currentTrackRef.current === url && isPlayingRef.current) return

    // Fade out current track if playing
    if (isPlayingRef.current) {
      await fadeOut(600)
    }

    const tryPlay = async (src) => {
      el.src = src
      el.load()
      currentTrackRef.current = src
      setCurrentTrack(src)
      await el.play()
      fadeIn(0.4, 2000)
    }

    try {
      await tryPlay(url)
    } catch (err) {
      console.warn('Primary audio failed:', url, err.message)
      if (fallbackUrl && fallbackUrl !== url) {
        try {
          await tryPlay(fallbackUrl)
        } catch (err2) {
          console.warn('Fallback audio also failed:', err2.message)
        }
      }
    }
  }, [fadeIn, fadeOut])

  // Toggle: pause if playing, resume if paused
  const toggle = useCallback(async () => {
    const el = audioRef.current
    if (!el) return

    if (isPlayingRef.current) {
      await fadeOut(600)
    } else {
      // If there is a src loaded, resume it
      if (el.src && el.src !== window.location.href) {
        try {
          await el.play()
          fadeIn(0.4, 1000)
        } catch (err) {
          console.warn('Toggle play failed:', err.message)
        }
      }
      // If no src at all, toggle does nothing (nothing to resume)
    }
  }, [fadeIn, fadeOut])

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
