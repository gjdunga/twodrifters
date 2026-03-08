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

    // Toro nagashi (floating water lanterns): square paper body on wooden raft
    s.lanterns = Array.from({ length: 6 }, () => ({
      x: (w * 0.1) + Math.random() * (w * 0.8),
      y: waterLine + 8 + Math.random() * (h * 0.18),
      baseY: 0,
      size: 20 + Math.random() * 10,
      speed: 0.1 + Math.random() * 0.15,
      bobSpeed: 0.006 + Math.random() * 0.004,
      bobAmount: 1.5 + Math.random() * 1.5,
      bobOffset: Math.random() * Math.PI * 2,
      tiltOffset: Math.random() * Math.PI * 2,
      hue: [15, 20, 25, 8, 30][Math.floor(Math.random() * 5)],
      paperAlpha: 0.85 + Math.random() * 0.1,
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

    // ---- TORO NAGASHI (floating water lanterns) ----
    s.lanterns.forEach((lan) => {
      // Update position: gentle drift
      lan.x += lan.speed * (0.3 + Math.sin(t * 0.0015 + lan.bobOffset) * 0.2)
      if (lan.x > w + 50) lan.x = -50
      lan.y = lan.baseY + Math.sin(t * lan.bobSpeed + lan.bobOffset) * lan.bobAmount

      const lx = lan.x
      const ly = lan.y
      const sz = lan.size
      const half = sz / 2
      const flicker = 0.82 + Math.sin(t * 0.06 + lan.bobOffset) * 0.12
        + Math.sin(t * 0.13 + lan.tiltOffset) * 0.06
      // Gentle tilt from water motion
      const tilt = Math.sin(t * 0.008 + lan.tiltOffset) * 0.04

      ctx.save()
      ctx.translate(lx, ly)
      ctx.rotate(tilt)

      // --- Water reflection glow ---
      const reflGlow = ctx.createRadialGradient(0, sz * 0.8, 1, 0, sz * 1.5, sz * 2.5)
      reflGlow.addColorStop(0, `rgba(255, ${150 + lan.hue * 3}, ${50 + lan.hue}, ${0.1 * flicker})`)
      reflGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = reflGlow
      ctx.fillRect(-sz * 2.5, sz * 0.3, sz * 5, sz * 3)

      // --- Air glow around lantern ---
      const airGlow = ctx.createRadialGradient(0, -half * 0.3, sz * 0.2, 0, -half * 0.3, sz * 2)
      airGlow.addColorStop(0, `rgba(255, ${160 + lan.hue * 2}, ${60 + lan.hue}, ${0.1 * flicker})`)
      airGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = airGlow
      ctx.beginPath()
      ctx.arc(0, -half * 0.3, sz * 2, 0, Math.PI * 2)
      ctx.fill()

      // --- Wooden raft base ---
      // Flat platform sitting on water surface
      const raftH = sz * 0.15
      const raftW = sz * 1.3
      const raftY = half * 0.3
      ctx.fillStyle = `rgba(60, 35, 18, ${0.9 * flicker})`
      ctx.fillRect(-raftW / 2, raftY, raftW, raftH)
      // Raft edge highlight
      ctx.fillStyle = `rgba(90, 55, 28, ${0.5 * flicker})`
      ctx.fillRect(-raftW / 2, raftY, raftW, 1.5)
      // Raft planks (subtle)
      ctx.strokeStyle = `rgba(40, 22, 10, ${0.4 * flicker})`
      ctx.lineWidth = 0.5
      for (let p = -raftW / 2 + raftW * 0.25; p < raftW / 2; p += raftW * 0.25) {
        ctx.beginPath()
        ctx.moveTo(p, raftY)
        ctx.lineTo(p, raftY + raftH)
        ctx.stroke()
      }

      // --- Paper body (square) ---
      const bodyTop = -half * 0.9
      const bodyH = sz * 1.1
      const bodyW = sz * 0.95
      // Warm paper gradient: lit from inside
      const paperGrad = ctx.createRadialGradient(
        0, bodyTop + bodyH * 0.45, sz * 0.1,
        0, bodyTop + bodyH * 0.45, sz * 0.7
      )
      paperGrad.addColorStop(0, `rgba(255, ${200 + lan.hue}, ${100 + lan.hue * 2}, ${lan.paperAlpha * flicker})`)
      paperGrad.addColorStop(0.5, `rgba(255, ${160 + lan.hue}, ${60 + lan.hue}, ${(lan.paperAlpha - 0.1) * flicker})`)
      paperGrad.addColorStop(1, `rgba(200, ${110 + lan.hue}, ${30 + lan.hue}, ${(lan.paperAlpha - 0.2) * flicker})`)
      ctx.fillStyle = paperGrad
      ctx.fillRect(-bodyW / 2, bodyTop, bodyW, bodyH)

      // --- Wooden frame edges ---
      ctx.strokeStyle = `rgba(70, 38, 15, ${0.7 * flicker})`
      ctx.lineWidth = 1.2
      // Outer frame rectangle
      ctx.strokeRect(-bodyW / 2, bodyTop, bodyW, bodyH)
      // Cross frame: vertical center
      ctx.beginPath()
      ctx.moveTo(0, bodyTop)
      ctx.lineTo(0, bodyTop + bodyH)
      ctx.stroke()
      // Cross frame: horizontal center
      ctx.beginPath()
      ctx.moveTo(-bodyW / 2, bodyTop + bodyH * 0.5)
      ctx.lineTo(bodyW / 2, bodyTop + bodyH * 0.5)
      ctx.stroke()

      // --- Roof cap ---
      const roofY = bodyTop - sz * 0.08
      const roofW = bodyW * 1.15
      const roofH = sz * 0.12
      ctx.fillStyle = `rgba(55, 30, 15, ${0.85 * flicker})`
      ctx.beginPath()
      ctx.moveTo(-roofW / 2, bodyTop)
      ctx.lineTo(0, roofY)
      ctx.lineTo(roofW / 2, bodyTop)
      ctx.closePath()
      ctx.fill()
      // Roof edge
      ctx.fillRect(-roofW / 2 - 1, bodyTop - 1, roofW + 2, 2)

      // --- Small finial on top ---
      ctx.fillStyle = `rgba(70, 40, 18, ${0.8 * flicker})`
      ctx.fillRect(-1.5, roofY - 4, 3, 4)

      // --- Candle flame inside (bright core) ---
      const flameX = Math.sin(t * 0.1 + lan.tiltOffset) * 1.2
      const flameY = bodyTop + bodyH * 0.42
      const flameGrad = ctx.createRadialGradient(
        flameX, flameY, 0,
        flameX, flameY, sz * 0.18
      )
      flameGrad.addColorStop(0, `rgba(255, 255, 220, ${0.6 * flicker})`)
      flameGrad.addColorStop(0.4, `rgba(255, 200, 80, ${0.3 * flicker})`)
      flameGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = flameGrad
      ctx.beginPath()
      ctx.arc(flameX, flameY, sz * 0.18, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
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
