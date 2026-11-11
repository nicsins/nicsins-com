<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  sites: { type: Array, default: () => [] },
  activeId: { type: String, default: null },
})
const emit = defineEmits(['select'])

const canvasRef = ref(null)
const wrapRef = ref(null)
let raf = 0
let nodes = []
let reduce = false
let t0 = 0

function layout(w, h) {
  const n = props.sites.length || 1
  const cx = w * 0.52
  const cy = h * 0.48
  const rx = Math.min(w, h) * 0.38
  const ry = Math.min(w, h) * 0.32
  nodes = props.sites.map((site, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    const jitter = ((i * 37) % 11) / 11
    return {
      id: site.id,
      site,
      x: cx + Math.cos(a) * rx * (0.72 + jitter * 0.28),
      y: cy + Math.sin(a) * ry * (0.7 + ((i * 13) % 7) / 20),
      r: site.status === 'live' ? 4.5 : 3.5,
      phase: i * 0.7,
    }
  })
}

function draw(ts) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    layout(w, h)
  }
  ctx.clearRect(0, 0, w, h)
  const t = reduce ? 0 : (ts - t0) / 1000

  // links
  ctx.lineWidth = 1
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i]
      const b = nodes[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d = Math.hypot(dx, dy)
      if (d > Math.min(w, h) * 0.28) continue
      const active = props.activeId && (a.id === props.activeId || b.id === props.activeId)
      ctx.strokeStyle = active ? 'rgba(79,209,181,0.35)' : 'rgba(36,43,51,0.9)'
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
      if (active && !reduce) {
        const p = (Math.sin(t * 1.6 + a.phase) + 1) / 2
        ctx.fillStyle = '#4FD1B5'
        ctx.beginPath()
        ctx.arc(a.x + (b.x - a.x) * p, a.y + (b.y - a.y) * p, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  for (const n of nodes) {
    const isActive = n.id === props.activeId
    const pulse = reduce ? 1 : 1 + Math.sin(t * 2 + n.phase) * 0.08
    const r = n.r * (isActive ? 2.2 : pulse)
    if (isActive) {
      ctx.fillStyle = 'rgba(79,209,181,0.15)'
      ctx.beginPath()
      ctx.arc(n.x, n.y, r * 3.2, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = n.site.status === 'dev' || n.site.status === 'preview' ? '#C2B48A' : '#4FD1B5'
    if (!isActive && n.site.status === 'live') ctx.fillStyle = '#4FD1B5'
    if (!isActive && (n.site.status === 'dev' || n.site.status === 'preview')) {
      ctx.strokeStyle = '#C2B48A'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  if (!reduce) raf = requestAnimationFrame(draw)
}

function onResize() {
  const canvas = canvasRef.value
  if (!canvas) return
  layout(canvas.clientWidth, canvas.clientHeight)
}

function hitTest(e) {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  let best = null
  let bestD = 18
  for (const n of nodes) {
    const d = Math.hypot(n.x - x, n.y - y)
    if (d < bestD) {
      bestD = d
      best = n
    }
  }
  if (best) emit('select', best.site, { x: e.clientX, y: e.clientY })
}

onMounted(() => {
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  t0 = performance.now()
  onResize()
  window.addEventListener('resize', onResize)
  raf = requestAnimationFrame(draw)
})
onUnmounted(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', onResize)
})
watch(() => props.sites, () => onResize())
</script>

<template>
  <div ref="wrapRef" class="net" aria-hidden="true">
    <canvas ref="canvasRef" class="net__canvas" @click="hitTest"></canvas>
  </div>
</template>

<style scoped>
.net {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.net__canvas {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: auto;
  cursor: crosshair;
}
</style>
