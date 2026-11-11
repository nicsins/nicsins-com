<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  category: { type: Object, required: true },
  activeId: { type: String, default: null },
})
const emit = defineEmits(['select'])

function onPick(site, evt) {
  const el = evt?.currentTarget
  const r = el?.getBoundingClientRect?.()
  const origin = r
    ? { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    : { x: evt?.clientX || window.innerWidth / 2, y: evt?.clientY || window.innerHeight / 2 }
  emit('select', site, origin)
}


const angle = ref(0)
const dragging = ref(false)
const hold = ref(false)
const reduce = ref(false)
const listMode = ref(false)
let raf = 0
let lastY = 0
let vel = 0
let lastT = 0
let mqNarrow = null

const count = computed(() => props.category.sites.length)
const itemAngle = computed(() => (count.value ? 360 / Math.max(count.value, 3) : 120))

function tick(ts) {
  if (!listMode.value && !reduce.value && !dragging.value && !hold.value) {
    angle.value = (angle.value + 0.08) % 360
  } else if (!dragging.value && Math.abs(vel) > 0.02) {
    angle.value = (angle.value + vel) % 360
    vel *= 0.95
  }
  raf = requestAnimationFrame(tick)
}

function onPointerDown(e) {
  dragging.value = true
  lastY = e.clientY
  lastT = performance.now()
  vel = 0
  e.currentTarget.setPointerCapture?.(e.pointerId)
}
function onPointerMove(e) {
  if (!dragging.value) return
  const dy = e.clientY - lastY
  const dt = Math.max(16, performance.now() - lastT)
  angle.value = (angle.value + dy * 0.35) % 360
  vel = (dy * 0.35) / (dt / 16)
  lastY = e.clientY
  lastT = performance.now()
}
function onPointerUp() {
  dragging.value = false
}
function onWheel(e) {
  e.preventDefault()
  angle.value = (angle.value + e.deltaY * 0.12) % 360
  vel = e.deltaY * 0.02
}

function styleFor(i) {
  const a = ((i * itemAngle.value) - angle.value) * (Math.PI / 180)
  const y = Math.sin(a) * 110
  const z = Math.cos(a) * 90
  const scale = Math.min(1, 0.72 + (z + 90) / 360)
  const opacity = 0.28 + (z + 90) / 220
  return {
    transform: `translate(-50%, -50%) translateY(${y}px) translateZ(${z}px) scale(${scale})`,
    opacity: Math.max(0.2, Math.min(1, opacity)),
    zIndex: Math.round(z + 100),
  }
}

function syncMode() {
  reduce.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Drum clips short categories (2–3 items). List is the readable default then.
  listMode.value = window.matchMedia('(max-width: 720px)').matches || count.value <= 8
}

onMounted(() => {
  syncMode()
  mqNarrow = window.matchMedia('(max-width: 720px)')
  mqNarrow.addEventListener?.('change', syncMode)
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', syncMode)
  raf = requestAnimationFrame(tick)
})
onUnmounted(() => {
  cancelAnimationFrame(raf)
  mqNarrow?.removeEventListener?.('change', syncMode)
})
watch(() => props.category.id, () => { angle.value = 0 })
watch(count, syncMode)
</script>

<template>
  <section class="wheel" :aria-label="category.label">
    <header class="wheel__head">
      <p class="wheel__label">{{ category.label }}</p>
      <p class="wheel__count">{{ String(count).padStart(2, '0') }}</p>
    </header>
    <div
      v-if="listMode"
      class="wheel__list"
      role="listbox"
      :aria-label="`${category.label} sites`"
    >
      <button
        v-for="site in category.sites"
        :key="site.id"
        type="button"
        role="option"
        class="wheel__row"
        :class="{
          'is-active': site.id === activeId,
          'is-dev': site.status === 'dev' || site.status === 'preview',
        }"
        :aria-selected="site.id === activeId"
        @click="onPick(site, $event)"
      >
        <span
          v-if="site.status === 'dev' || site.status === 'preview'"
          class="wheel__badge"
        >{{ site.tag || 'In development' }}</span>
        <span class="wheel__name">{{ site.name }}</span>
        <span class="wheel__host">{{ site.host || 'no public URL yet' }}</span>
      </button>
    </div>
    <div
      v-else
      class="wheel__drum"
      role="listbox"
      :aria-label="`${category.label} sites`"
      tabindex="0"
      @pointerenter="hold = true"
      @pointerleave="hold = false; dragging = false"
      @focusin="hold = true"
      @focusout="hold = false"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @wheel="onWheel"
      @keydown.up.prevent="angle = (angle - itemAngle) % 360"
      @keydown.down.prevent="angle = (angle + itemAngle) % 360"
    >
      <div class="wheel__stage">
        <button
          v-for="(site, i) in category.sites"
          :key="site.id"
          type="button"
          role="option"
          class="wheel__item"
          :class="{
            'is-active': site.id === activeId,
            'is-dev': site.status === 'dev' || site.status === 'preview',
          }"
          :style="styleFor(i)"
          :aria-selected="site.id === activeId"
          @click.stop="onPick(site, $event)"
        >
          <span
            v-if="site.status === 'dev' || site.status === 'preview'"
            class="wheel__badge"
          >{{ site.tag || 'In development' }}</span>
          <span class="wheel__name">{{ site.name }}</span>
          <span class="wheel__host">{{ site.host || 'no public URL yet' }}</span>
        </button>
      </div>
      <div class="wheel__fade wheel__fade--top" aria-hidden="true" />
      <div class="wheel__fade wheel__fade--bot" aria-hidden="true" />
    </div>
  </section>
</template>

<style scoped>
.wheel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  flex: 1 1 180px;
  max-width: 240px;
}
.wheel__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 4px;
}
.wheel__label {
  margin: 0;
  font: 500 var(--ns-fs-xs)/1 var(--ns-font-mono);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ns-muted);
}
.wheel__count {
  margin: 0;
  font: 400 var(--ns-fs-xs)/1 var(--ns-font-mono);
  color: var(--ns-faint);
  font-variant-numeric: tabular-nums;
}
.wheel__drum {
  position: relative;
  height: 280px;
  border: 1px solid var(--ns-border);
  border-radius: var(--ns-r-lg);
  background: var(--ns-surface);
  overflow: hidden;
  touch-action: none;
  cursor: grab;
  perspective: 800px;
}
.wheel__drum:active { cursor: grabbing; }
.wheel__drum:focus-visible { box-shadow: var(--ns-ring); }
.wheel__stage {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}
.wheel__item {
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(100% - 24px);
  padding: 12px 14px;
  border-radius: var(--ns-r-md);
  border: 1px solid var(--ns-border);
  background: var(--ns-surface);
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: border-color var(--ns-med) var(--ns-ease), background var(--ns-med) var(--ns-ease);
  will-change: transform, opacity;
}
.wheel__item.is-active {
  border-color: var(--ns-accent);
  background: var(--ns-surface-2);
  box-shadow: 0 0 0 1px rgba(79, 209, 181, 0.25);
}
.wheel__item.is-dev {
  border-style: dashed;
  background: transparent;
}
.wheel__item:hover { border-color: var(--ns-border-strong); }
.wheel__name {
  font: 600 var(--ns-fs-sm)/1.25 var(--ns-font-display);
  color: var(--ns-text);
}
.wheel__host {
  font: 400 11px/1.3 var(--ns-font-mono);
  color: var(--ns-faint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.wheel__badge {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 20px;
  padding: 0 8px;
  border-radius: var(--ns-r-pill);
  font: 500 10px/1 var(--ns-font-mono);
  color: var(--ns-dev);
  background: var(--ns-dev-wash);
  border: 1px solid rgba(194, 180, 138, 0.22);
  margin-bottom: 2px;
}
.wheel__badge::before {
  content: "";
  width: 5px;
  height: 5px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
}
.wheel__fade {
  position: absolute;
  left: 0;
  right: 0;
  height: 56px;
  pointer-events: none;
  z-index: 5;
}
.wheel__fade--top {
  top: 0;
  background: linear-gradient(to bottom, rgba(10, 12, 15, 0.85), transparent);
}
.wheel__fade--bot {
  bottom: 0;
  background: linear-gradient(to top, rgba(10, 12, 15, 0.85), transparent);
}
@media (max-width: 720px) {
  .wheel { max-width: none; flex: 1 1 auto; width: 100%; }
}
.wheel__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.wheel__row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  text-align: left;
  padding: 12px 14px;
  border-radius: var(--ns-r-md);
  border: 1px solid var(--ns-border);
  background: var(--ns-surface);
  min-height: 44px;
}
.wheel__row.is-active {
  border-color: var(--ns-accent);
  background: var(--ns-surface-2);
}
.wheel__row.is-dev {
  border-style: dashed;
  background: transparent;
}
.wheel__row:hover { border-color: var(--ns-border-strong); }
.wheel__row:focus-visible { box-shadow: var(--ns-ring); }
@media (prefers-reduced-motion: reduce) {
  .wheel__item { transition: none; }
}
</style>
