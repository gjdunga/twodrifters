import { useRef, useEffect, useCallback } from 'react'

export default function PondScene() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const stateRef = useRef({
    lanterns: [],
    ripples: [],
    stars: [],
    fireflies: [],
    time: 0,
  })

  const initScene = useCallback((canvas) => {
    const s = stateRef.current
    const w = canvas.width
    const h = canvas.height
    const waterLine = h * 0.48

    // Stars
    s.stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * waterLine * 0.85,
      r: Math.random() * 1.5 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
      brightness: Math.random() * 0.6 + 0.4,
    }))

    // Lanterns floating on water
    s.lanterns = Array.from({ length: 5 }, (_, i) => ({
      x: (w * 0.15) + Math.random() * (w * 0.7),
      y: waterLine + 10 + Math.random() * (h * 0.15),
      baseY: 0,
      width: 18 + Math.random() * 10,
      height: 22 + Math.random() * 8,
      speed: 0.15 + Math.random() * 0.2,
      bobSpeed: 0.008 + Math.random() * 0.005,
      bobAmount: 2 + Math.random() * 2,
      bobOffset: Math.random() * Math.PI * 2,
      glowIntensity: 0.6 + Math.random() * 0.4,
      hue: Math.random() > 0.5 ? 25 : 10, // warm orange/red
    }))
    s.lanterns.forEach((l) => { l.baseY = l.y })

    // Fireflies
    s.fireflies = Array.from({ length: 15 }, () => ({
      x: Math.random() * w,
      y: waterLine * 0.4 + Math.random() * waterLine * 0.55,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2,
      size: Math.random() * 2 + 1,
    }))
  }, [])

  const draw = useCallback((canvas, ctx) => {
    const s = stateRef.current
    const w = canvas.width
    const h = canvas.height
    const waterLine = h * 0.48
    const t = s.time

    ctx.clearRect(0, 0, w, h)

    // ---- SKY ----
    const skyGrad = ctx.createLinearGradient(0, 0, 0, waterLine)
    skyGrad.addColorStop(0, '#050810')
    skyGrad.addColorStop(0.4, '#0a1628')
    skyGrad.addColorStop(0.7, '#0f2040')
    skyGrad.addColorStop(1, '#162d4a')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, w, waterLine)

    // ---- STARS ----
    s.stars.forEach((star) => {
      const twinkle = Math.sin(t * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7
      const alpha = star.brightness * twinkle
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 250, 240, ${alpha})`
      ctx.fill()
    })

    // ---- DISTANT TREELINE (silhouette) ----
    ctx.beginPath()
    ctx.moveTo(0, waterLine)
    for (let x = 0; x <= w; x += 3) {
      const treeHeight =
        Math.sin(x * 0.008) * 25 +
        Math.sin(x * 0.02) * 12 +
        Math.sin(x * 0.05) * 6 +
        Math.cos(x * 0.003 + 1) * 15
      ctx.lineTo(x, waterLine - 30 - Math.max(0, treeHeight))
    }
    ctx.lineTo(w, waterLine)
    ctx.closePath()
    ctx.fillStyle = '#0a1520'
    ctx.fill()

    // ---- MOON ----
    const moonX = w * 0.68
    const moonY = waterLine * 0.32
    const moonR = Math.min(w, h) * 0.065

    // Moon glow
    const moonGlow = ctx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 6)
    moonGlow.addColorStop(0, 'rgba(255, 239, 213, 0.12)')
    moonGlow.addColorStop(0.3, 'rgba(255, 239, 213, 0.06)')
    moonGlow.addColorStop(1, 'transparent')
    ctx.fillStyle = moonGlow
    ctx.fillRect(0, 0, w, waterLine)

    // Moon body
    const moonBodyGrad = ctx.createRadialGradient(
      moonX - moonR * 0.2, moonY - moonR * 0.2, 0,
      moonX, moonY, moonR
    )
    moonBodyGrad.addColorStop(0, '#fffcf0')
    moonBodyGrad.addColorStop(0.4, '#ffefd5')
    moonBodyGrad.addColorStop(0.8, '#f5deb3')
    moonBodyGrad.addColorStop(1, '#deb887')
    ctx.beginPath()
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2)
    ctx.fillStyle = moonBodyGrad
    ctx.fill()

    // Moon craters (subtle)
    ctx.globalAlpha = 0.08
    ctx.beginPath()
    ctx.arc(moonX + moonR * 0.25, moonY - moonR * 0.1, moonR * 0.2, 0, Math.PI * 2)
    ctx.fillStyle = '#b8860b'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(moonX - moonR * 0.3, moonY + moonR * 0.3, moonR * 0.15, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1

    // ---- WATER ----
    const waterGrad = ctx.createLinearGradient(0, waterLine, 0, h)
    waterGrad.addColorStop(0, '#0d2035')
    waterGrad.addColorStop(0.3, '#091a2c')
    waterGrad.addColorStop(1, '#060e18')
    ctx.fillStyle = waterGrad
    ctx.fillRect(0, waterLine, w, h - waterLine)

    // ---- MOON REFLECTION on water ----
    const reflY = waterLine + (waterLine - moonY) * 0.3
    for (let i = 0; i < 30; i++) {
      const segY = reflY + i * 4
      const waveOff = Math.sin(t * 0.015 + i * 0.4) * (3 + i * 0.5)
      const alpha = Math.max(0, 0.15 - i * 0.004)
      const segW = moonR * (1.2 + i * 0.1)
      ctx.beginPath()
      ctx.ellipse(moonX + waveOff, segY, segW, 1.5, 0, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 239, 213, ${alpha})`
      ctx.fill()
    }

    // ---- WATER RIPPLES ----
    for (let i = 0; i < 8; i++) {
      const ripY = waterLine + 20 + i * ((h - waterLine - 20) / 8)
      const wave1 = Math.sin(t * 0.01 + i * 0.8) * 0.5
      ctx.beginPath()
      ctx.moveTo(0, ripY)
      for (let x = 0; x <= w; x += 4) {
        const y =
          ripY +
          Math.sin(x * 0.01 + t * 0.008 + i) * 2 +
          Math.sin(x * 0.025 + t * 0.012) * 1 +
          wave1
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = `rgba(180, 210, 240, ${0.035 - i * 0.003})`
      ctx.lineWidth = 0.8
      ctx.stroke()
    }

    // ---- LANTERNS ----
    s.lanterns.forEach((lan) => {
      // Update position
      lan.x += lan.speed * (Math.sin(t * 0.002) * 0.5 + 0.5) * 0.3
      if (lan.x > w + 30) lan.x = -30
      lan.y = lan.baseY + Math.sin(t * lan.bobSpeed + lan.bobOffset) * lan.bobAmount

      const lx = lan.x
      const ly = lan.y
      const lw = lan.width
      const lh = lan.height
      const flicker = 0.85 + Math.sin(t * 0.05 + lan.bobOffset) * 0.15

      // Lantern glow on water
      const waterGlow = ctx.createRadialGradient(lx, ly + lh, 2, lx, ly + lh * 2, lh * 3)
      waterGlow.addColorStop(0, `rgba(255, ${150 + lan.hue * 2}, ${50 + lan.hue}, ${0.08 * flicker})`)
      waterGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = waterGlow
      ctx.fillRect(lx - lh * 3, ly, lh * 6, lh * 4)

      // Lantern glow (air)
      const airGlow = ctx.createRadialGradient(lx, ly, lw * 0.3, lx, ly, lw * 2.5)
      airGlow.addColorStop(0, `rgba(255, ${160 + lan.hue * 2}, ${60 + lan.hue}, ${0.12 * flicker})`)
      airGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = airGlow
      ctx.beginPath()
      ctx.arc(lx, ly, lw * 2.5, 0, Math.PI * 2)
      ctx.fill()

      // Lantern body
      const bodyGrad = ctx.createLinearGradient(lx, ly - lh / 2, lx, ly + lh / 2)
      bodyGrad.addColorStop(0, `rgba(255, ${180 + lan.hue}, ${80 + lan.hue}, ${0.9 * flicker})`)
      bodyGrad.addColorStop(0.5, `rgba(255, ${140 + lan.hue}, ${40 + lan.hue}, ${0.95 * flicker})`)
      bodyGrad.addColorStop(1, `rgba(200, ${100 + lan.hue}, ${30 + lan.hue}, ${0.7 * flicker})`)
      ctx.fillStyle = bodyGrad

      // Rounded lantern shape
      ctx.beginPath()
      ctx.ellipse(lx, ly, lw / 2, lh / 2, 0, 0, Math.PI * 2)
      ctx.fill()

      // Frame lines
      ctx.strokeStyle = `rgba(80, 40, 20, ${0.4 * flicker})`
      ctx.lineWidth = 0.8
      ctx.beginPath()
      ctx.moveTo(lx, ly - lh / 2)
      ctx.lineTo(lx, ly + lh / 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(lx - lw / 2, ly)
      ctx.lineTo(lx + lw / 2, ly)
      ctx.stroke()

      // Top knob
      ctx.fillStyle = `rgba(60, 30, 15, 0.8)`
      ctx.fillRect(lx - 2, ly - lh / 2 - 4, 4, 5)
    })

    // ---- FIREFLIES ----
    s.fireflies.forEach((ff) => {
      ff.x += ff.vx + Math.sin(t * 0.01 + ff.phase) * 0.1
      ff.y += ff.vy + Math.cos(t * 0.008 + ff.phase) * 0.08
      ff.phase += 0.02

      if (ff.x < -10) ff.x = w + 10
      if (ff.x > w + 10) ff.x = -10
      if (ff.y < waterLine * 0.3) ff.vy = Math.abs(ff.vy)
      if (ff.y > waterLine - 10) ff.vy = -Math.abs(ff.vy)

      const glow = Math.sin(ff.phase) * 0.5 + 0.5
      const ffGrad = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.size * 4)
      ffGrad.addColorStop(0, `rgba(200, 255, 150, ${0.6 * glow})`)
      ffGrad.addColorStop(0.5, `rgba(180, 255, 100, ${0.2 * glow})`)
      ffGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = ffGrad
      ctx.beginPath()
      ctx.arc(ff.x, ff.y, ff.size * 4, 0, Math.PI * 2)
      ctx.fill()
    })

    // ---- FOREGROUND REEDS (left) ----
    ctx.save()
    ctx.globalAlpha = 0.4
    for (let i = 0; i < 6; i++) {
      const rx = 15 + i * 12
      const sway = Math.sin(t * 0.006 + i * 0.5) * 4
      ctx.beginPath()
      ctx.moveTo(rx, h)
      ctx.quadraticCurveTo(rx + sway, h - 80, rx + sway * 1.5, waterLine - 20 - i * 8)
      ctx.strokeStyle = '#0a1a10'
      ctx.lineWidth = 2.5 - i * 0.3
      ctx.stroke()
    }
    // Right side reeds
    for (let i = 0; i < 4; i++) {
      const rx = w - 20 - i * 14
      const sway = Math.sin(t * 0.007 + i * 0.7 + 2) * 3
      ctx.beginPath()
      ctx.moveTo(rx, h)
      ctx.quadraticCurveTo(rx + sway, h - 60, rx + sway * 1.5, waterLine - 10 - i * 6)
      ctx.strokeStyle = '#0a1a10'
      ctx.lineWidth = 2 - i * 0.3
      ctx.stroke()
    }
    ctx.restore()

    s.time++
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      initScene(canvas)
    }

    resize()
    window.addEventListener('resize', resize)

    const loop = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      ctx.save()
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(canvas, ctx)
      ctx.restore()
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [draw, initScene])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  )
}
