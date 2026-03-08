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

    // Toy junk boats floating on water
    s.junks = Array.from({ length: 5 }, () => {
      const size = 28 + Math.random() * 18
      return {
        x: (w * 0.08) + Math.random() * (w * 0.84),
        y: waterLine + 6 + Math.random() * (h * 0.2),
        baseY: 0,
        size,
        speed: 0.08 + Math.random() * 0.14,
        dir: Math.random() > 0.3 ? 1 : -1,
        bobSpeed: 0.005 + Math.random() * 0.004,
        bobAmount: 1.2 + Math.random() * 1.8,
        bobOffset: Math.random() * Math.PI * 2,
        tiltOffset: Math.random() * Math.PI * 2,
        sailColor: ['#b83a2a', '#c44530', '#a33020', '#d4553e', '#8b2010'][Math.floor(Math.random() * 5)],
        hullColor: ['#3a2010', '#4a2a15', '#30180a'][Math.floor(Math.random() * 3)],
        numSails: Math.random() > 0.4 ? 2 : 1,
        lanternHue: 15 + Math.random() * 20,
      }
    })
    s.junks.forEach((j) => { j.baseY = j.y })

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

    // ---- TOY JUNK BOATS ----
    s.junks.forEach((jk) => {
      // Drift across water
      jk.x += jk.speed * jk.dir * (0.4 + Math.sin(t * 0.001 + jk.bobOffset) * 0.15)
      if (jk.dir > 0 && jk.x > w + 60) jk.x = -60
      if (jk.dir < 0 && jk.x < -60) jk.x = w + 60
      jk.y = jk.baseY + Math.sin(t * jk.bobSpeed + jk.bobOffset) * jk.bobAmount

      const sz = jk.size
      const tilt = Math.sin(t * 0.007 + jk.tiltOffset) * 0.035
      const flicker = 0.85 + Math.sin(t * 0.055 + jk.bobOffset) * 0.15

      ctx.save()
      ctx.translate(jk.x, jk.y)
      ctx.rotate(tilt)
      // Flip drawing if sailing left so the boat faces its direction
      if (jk.dir < 0) ctx.scale(-1, 1)

      // --- Warm glow reflection on water ---
      const reflGlow = ctx.createRadialGradient(0, sz * 0.5, 1, 0, sz * 1.2, sz * 2)
      reflGlow.addColorStop(0, `rgba(255, ${160 + jk.lanternHue * 2}, ${60 + jk.lanternHue}, ${0.07 * flicker})`)
      reflGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = reflGlow
      ctx.fillRect(-sz * 2, sz * 0.2, sz * 4, sz * 2.5)

      // --- Hull ---
      // Junk hull: wide flat bottom, flared bow (right), raised stern (left)
      const hullW = sz * 1.4
      const hullH = sz * 0.35
      const hullTop = 0
      const bowX = hullW * 0.5      // right side (forward)
      const sternX = -hullW * 0.5   // left side (aft)

      ctx.beginPath()
      // Start at stern waterline
      ctx.moveTo(sternX, hullTop)
      // Stern rises up slightly
      ctx.lineTo(sternX - sz * 0.05, hullTop - hullH * 0.3)
      // Deck line across to bow
      ctx.lineTo(bowX + sz * 0.12, hullTop - hullH * 0.15)
      // Bow tip curves up and forward
      ctx.lineTo(bowX + sz * 0.22, hullTop - hullH * 0.6)
      // Down to bow waterline
      ctx.quadraticCurveTo(bowX + sz * 0.15, hullTop + hullH * 0.2, bowX, hullTop + hullH * 0.6)
      // Flat bottom with gentle curve
      ctx.quadraticCurveTo(0, hullTop + hullH * 0.85, sternX + sz * 0.05, hullTop + hullH * 0.5)
      // Back up to stern
      ctx.closePath()

      // Hull fill: dark wood
      const hullGrad = ctx.createLinearGradient(0, hullTop - hullH, 0, hullTop + hullH)
      hullGrad.addColorStop(0, jk.hullColor)
      hullGrad.addColorStop(1, '#1a0c04')
      ctx.fillStyle = hullGrad
      ctx.fill()
      // Hull outline
      ctx.strokeStyle = `rgba(20, 10, 5, 0.7)`
      ctx.lineWidth = 1
      ctx.stroke()

      // --- Hull plank lines ---
      ctx.strokeStyle = `rgba(90, 55, 25, 0.25)`
      ctx.lineWidth = 0.5
      for (let i = 1; i <= 2; i++) {
        const py = hullTop + hullH * (0.15 * i)
        ctx.beginPath()
        ctx.moveTo(sternX + sz * 0.05, py)
        ctx.lineTo(bowX, py)
        ctx.stroke()
      }

      // --- Deck highlight ---
      ctx.fillStyle = `rgba(100, 60, 28, 0.5)`
      ctx.beginPath()
      ctx.moveTo(sternX + sz * 0.02, hullTop - hullH * 0.15)
      ctx.lineTo(bowX + sz * 0.08, hullTop - hullH * 0.08)
      ctx.lineTo(bowX + sz * 0.05, hullTop + hullH * 0.05)
      ctx.lineTo(sternX + sz * 0.05, hullTop + hullH * 0.05)
      ctx.closePath()
      ctx.fill()

      // --- Stern cabin ---
      const cabinW = sz * 0.3
      const cabinH = sz * 0.28
      const cabinX = sternX + sz * 0.08
      const cabinY = hullTop - hullH * 0.15 - cabinH
      ctx.fillStyle = `rgba(70, 40, 18, 0.9)`
      ctx.fillRect(cabinX, cabinY, cabinW, cabinH)
      // Cabin roof (slightly wider, slight overhang)
      ctx.fillStyle = `rgba(50, 28, 12, 0.95)`
      ctx.fillRect(cabinX - 2, cabinY - 3, cabinW + 4, 4)
      // Cabin window (warm glow)
      ctx.fillStyle = `rgba(255, ${180 + jk.lanternHue}, ${80 + jk.lanternHue}, ${0.6 * flicker})`
      ctx.fillRect(cabinX + cabinW * 0.25, cabinY + cabinH * 0.3, cabinW * 0.5, cabinH * 0.4)
      // Window frame
      ctx.strokeStyle = `rgba(40, 22, 10, 0.6)`
      ctx.lineWidth = 0.6
      ctx.strokeRect(cabinX + cabinW * 0.25, cabinY + cabinH * 0.3, cabinW * 0.5, cabinH * 0.4)

      // --- Mast and batten sails ---
      const drawSail = (mastX, mastH, sailW, sailH, sailTop) => {
        // Mast
        ctx.strokeStyle = `rgba(60, 35, 15, 0.9)`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(mastX, hullTop - hullH * 0.1)
        ctx.lineTo(mastX, hullTop - hullH * 0.1 - mastH)
        ctx.stroke()

        // Sail: trapezoidal (wider at bottom, narrower at top), leaning slightly
        const sTop = hullTop - hullH * 0.1 - sailTop
        const sBot = sTop + sailH
        const lean = sz * 0.04
        const topW = sailW * 0.6
        const botW = sailW

        ctx.beginPath()
        ctx.moveTo(mastX + lean - topW * 0.3, sTop)
        ctx.lineTo(mastX + lean + topW * 0.7, sTop)
        ctx.lineTo(mastX + botW * 0.7, sBot)
        ctx.lineTo(mastX - botW * 0.3, sBot)
        ctx.closePath()

        // Sail gradient
        const sailGrad = ctx.createLinearGradient(mastX, sTop, mastX, sBot)
        const sc = jk.sailColor
        sailGrad.addColorStop(0, sc)
        sailGrad.addColorStop(0.5, sc)
        sailGrad.addColorStop(1, '#6a1a08')
        ctx.fillStyle = sailGrad
        ctx.globalAlpha = 0.88
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.strokeStyle = `rgba(60, 15, 5, 0.5)`
        ctx.lineWidth = 0.6
        ctx.stroke()

        // Batten lines (horizontal bamboo rods)
        const battens = 4
        ctx.strokeStyle = `rgba(40, 20, 8, 0.5)`
        ctx.lineWidth = 0.7
        for (let b = 1; b < battens; b++) {
          const frac = b / battens
          const by = sTop + sailH * frac
          const bw = topW + (botW - topW) * frac
          ctx.beginPath()
          ctx.moveTo(mastX + lean * (1 - frac) - bw * 0.3, by)
          ctx.lineTo(mastX + lean * (1 - frac) + bw * 0.7, by)
          ctx.stroke()
        }
      }

      // Main sail
      const mainMastX = sternX + hullW * 0.45
      drawSail(mainMastX, sz * 1.3, sz * 0.65, sz * 0.9, sz * 1.2)

      // Second sail (if present, shorter and forward)
      if (jk.numSails >= 2) {
        const fwdMastX = sternX + hullW * 0.78
        drawSail(fwdMastX, sz * 0.95, sz * 0.45, sz * 0.6, sz * 0.85)
      }

      // --- Small stern lantern ---
      const lanX = sternX + sz * 0.06
      const lanY = cabinY - 6
      const lGlow = ctx.createRadialGradient(lanX, lanY, 0, lanX, lanY, sz * 0.15)
      lGlow.addColorStop(0, `rgba(255, 240, 180, ${0.7 * flicker})`)
      lGlow.addColorStop(0.5, `rgba(255, ${180 + jk.lanternHue}, ${70 + jk.lanternHue}, ${0.3 * flicker})`)
      lGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = lGlow
      ctx.beginPath()
      ctx.arc(lanX, lanY, sz * 0.15, 0, Math.PI * 2)
      ctx.fill()
      // Lantern body (tiny rectangle)
      ctx.fillStyle = `rgba(255, ${200 + jk.lanternHue}, ${100 + jk.lanternHue}, ${0.85 * flicker})`
      ctx.fillRect(lanX - 2, lanY - 2.5, 4, 5)
      ctx.strokeStyle = `rgba(80, 40, 15, 0.6)`
      ctx.lineWidth = 0.4
      ctx.strokeRect(lanX - 2, lanY - 2.5, 4, 5)

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
