import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'

const AudioContext = createContext(null)

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const audioRef = useRef(null)
  const fadeRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.loop = true
    audioRef.current.volume = 0

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
      if (fadeRef.current) clearInterval(fadeRef.current)
    }
  }, [])

  const fadeIn = useCallback((duration = 2000) => {
    if (!audioRef.current) return
    const steps = 40
    const stepTime = duration / steps
    const increment = 0.4 / steps
    let vol = 0
    audioRef.current.volume = 0

    if (fadeRef.current) clearInterval(fadeRef.current)
    fadeRef.current = setInterval(() => {
      vol = Math.min(vol + increment, 0.4)
      if (audioRef.current) audioRef.current.volume = vol
      if (vol >= 0.4 && fadeRef.current) clearInterval(fadeRef.current)
    }, stepTime)
  }, [])

  const fadeOut = useCallback((duration = 1000) => {
    return new Promise((resolve) => {
      if (!audioRef.current || audioRef.current.volume === 0) {
        resolve()
        return
      }
      const steps = 20
      const stepTime = duration / steps
      const decrement = audioRef.current.volume / steps

      if (fadeRef.current) clearInterval(fadeRef.current)
      fadeRef.current = setInterval(() => {
        const newVol = Math.max((audioRef.current?.volume || 0) - decrement, 0)
        if (audioRef.current) audioRef.current.volume = newVol
        if (newVol <= 0) {
          if (fadeRef.current) clearInterval(fadeRef.current)
          if (audioRef.current) audioRef.current.pause()
          resolve()
        }
      }, stepTime)
    })
  }, [])

  const play = useCallback(async (url, label) => {
    if (!audioRef.current) return
    if (currentTrack === url && isPlaying) return

    await fadeOut(800)
    audioRef.current.src = url
    setCurrentTrack(url)

    try {
      await audioRef.current.play()
      setIsPlaying(true)
      fadeIn()
    } catch (err) {
      console.log('Audio autoplay blocked, waiting for interaction')
    }
  }, [currentTrack, isPlaying, fadeIn, fadeOut])

  const toggle = useCallback(async () => {
    if (!audioRef.current) return
    if (isPlaying) {
      await fadeOut()
      setIsPlaying(false)
    } else {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        fadeIn()
      } catch (err) {
        console.log('Audio play failed')
      }
    }
  }, [isPlaying, fadeIn, fadeOut])

  const handleInteraction = useCallback(() => {
    if (!hasInteracted) setHasInteracted(true)
  }, [hasInteracted])

  return (
    <AudioContext.Provider
      value={{ isPlaying, hasInteracted, play, toggle, handleInteraction, currentTrack }}
    >
      <div onClick={handleInteraction} onTouchStart={handleInteraction}>
        {children}
      </div>
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio must be inside AudioProvider')
  return ctx
}
