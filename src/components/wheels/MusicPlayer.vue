<script setup>
/**
 * Port of nicsins/nicsins-com SunoDeck + self-hosted HTMLAudio playback.
 * Default bed (background: true): official Suno video_url AAC/mp4 streams,
 * started on first user gesture, looping, honoring ns-music-muted.
 * Other Suno tracks without src: embed iframe (progress/EQ decorative).
 * Self-hosted tracks (src): real progress, seek, Web Audio Analyser EQ.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { musicEnergy, musicPlaying } from './musicBus.js'

const props = defineProps({
  tracks: { type: Array, default: () => [] },
  profile: { type: String, default: 'https://suno.com/@nicsins' },
})

const MUTE_KEY = 'ns-music-muted'
const expanded = ref(false)
const activeId = ref(null)
const reduce = ref(false)
const playing = ref(false)
const muted = ref(false)
const hasGestured = ref(false)
let autoStarted = false
let removeGestureListeners = () => {}
const currentTime = ref(0)
const duration = ref(0)
const progressPct = ref(0)
const eqHeights = ref([4, 7, 5, 9, 4])
const audioEl = ref(null)
const progressRef = ref(null)

let audioCtx = null
let analyser = null
let sourceNode = null
let rafId = 0
let freqData = null

const active = computed(() => props.tracks.find((t) => t.id === activeId.value) || null)
const activeIndex = computed(() => props.tracks.findIndex((t) => t.id === activeId.value))
const isSelfHosted = computed(() => Boolean(active.value?.src))
const isSuno = computed(() => Boolean(active.value?.embedUrl) && !active.value?.src)
const isSunoStream = computed(() => Boolean(active.value?.src && (active.value?.songUrl || active.value?.embedUrl)))

function isBackground(track) {
  return Boolean(track?.background)
}
function backgroundTracks() {
  return props.tracks.filter(isBackground)
}

async function tryStartBed() {
  if (autoStarted) return
  if (!hasGestured.value || muted.value) return
  if (activeId.value && !isBackground(active.value)) return
  const bed = backgroundTracks()
  if (!bed[0]) return
  if (!activeId.value) activeId.value = bed[0].id
  const ok = await playSelf()
  if (ok) autoStarted = true
}

function onFirstGesture(evt) {
  hasGestured.value = true
  const t = evt.target
  if (t && t.closest && t.closest('.mp__play, .mp__track, .mp__mute, .mp__ctrl')) {
    return
  }
  tryStartBed()
}

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00'
  const s = Math.floor(sec)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

const displayTime = computed(() => {
  if (isSelfHosted.value && (playing.value || currentTime.value > 0)) {
    return `${formatTime(currentTime.value)} / ${formatTime(duration.value || 0)}`
  }
  return active.value?.time || '—'
})

function applyMute() {
  const el = audioEl.value
  if (el) el.muted = muted.value
  try { localStorage.setItem(MUTE_KEY, muted.value ? '1' : '0') } catch { /* ignore */ }
}
function toggleMute() {
  muted.value = !muted.value
  applyMute()
  if (!muted.value) tryStartBed()
}

function ensureAudioGraph(el) {
  if (!el) return
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    audioCtx = new AC()
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {})
  if (!sourceNode) {
    try {
      sourceNode = audioCtx.createMediaElementSource(el)
      analyser = audioCtx.createAnalyser()
      analyser.fftSize = 64
      analyser.smoothingTimeConstant = 0.7
      sourceNode.connect(analyser)
      analyser.connect(audioCtx.destination)
      freqData = new Uint8Array(analyser.frequencyBinCount)
    } catch {
      // Already connected from a prior mount — keep existing graph
    }
  }
}

function stopEqLoop() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
  }
}

function tickEq() {
  if (!analyser || !freqData || !playing.value || reduce.value) {
    stopEqLoop()
    return
  }
  analyser.getByteFrequencyData(freqData)
  const n = eqHeights.value.length
  const step = Math.max(1, Math.floor(freqData.length / n))
  const next = []
  for (let i = 0; i < n; i++) {
    const v = freqData[i * step] || 0
    next.push(Math.max(3, Math.round((v / 255) * 12)))
  }
  eqHeights.value = next
  const avg = next.reduce((a, b) => a + b, 0) / (next.length * 12)
  musicEnergy.value = Math.min(1, Math.max(0, avg))
  musicPlaying.value = true
  rafId = requestAnimationFrame(tickEq)
}

function onTimeUpdate() {
  const el = audioEl.value
  if (!el) return
  currentTime.value = el.currentTime || 0
  duration.value = el.duration || duration.value
  if (duration.value > 0) {
    progressPct.value = (currentTime.value / duration.value) * 100
  }
}

function onLoadedMeta() {
  const el = audioEl.value
  if (!el) return
  duration.value = el.duration || 0
}

function onEnded() {
  playing.value = false
  stopEqLoop()
  const bed = backgroundTracks()
  if (isBackground(active.value) && bed.length) {
    const i = bed.findIndex((t) => t.id === activeId.value)
    const nextBed = bed[(i + 1) % bed.length]
    if (nextBed) select(nextBed.id)
    return
  }
  next()
}

function pauseSelf() {
  const el = audioEl.value
  if (el) {
    el.pause()
  }
  playing.value = false
  musicPlaying.value = false
  musicEnergy.value = 0
  stopEqLoop()
}

async function playSelf() {
  const el = audioEl.value
  const track = active.value
  if (!el || !track?.src) return false
  if (el.getAttribute('data-src') !== track.src) {
    el.src = track.src
    el.setAttribute('data-src', track.src)
  }
  ensureAudioGraph(el)
  applyMute()
  try {
    await el.play()
    playing.value = true
    if (!reduce.value) {
      stopEqLoop()
      rafId = requestAnimationFrame(tickEq)
    }
    return true
  } catch {
    playing.value = false
    return false
  }
}

function select(id) {
  const nextTrack = props.tracks.find((t) => t.id === id)
  const wasSelf = Boolean(active.value?.src)
  if (wasSelf && (!nextTrack || nextTrack.id !== activeId.value)) {
    pauseSelf()
    currentTime.value = 0
    progressPct.value = 0
  }
  autoStarted = true
  hasGestured.value = true
  activeId.value = id
  expanded.value = true
  nextTick(() => {
    if (nextTrack?.src) {
      const el = audioEl.value
      if (el) {
        el.src = nextTrack.src
        el.setAttribute('data-src', nextTrack.src)
        currentTime.value = 0
        progressPct.value = 0
        duration.value = 0
        playSelf()
      }
    } else {
      pauseSelf()
      // Decorative pulse for Suno
      progressPct.value = 0
    }
  })
}

function toggleExpand() {
  expanded.value = !expanded.value
  if (expanded.value && !activeId.value && props.tracks[0]) {
    activeId.value = props.tracks[0].id
  }
}

function togglePlay() {
  if (!active.value) {
    hasGestured.value = true
    const first = backgroundTracks()[0] || props.tracks[0]
    if (first) {
      select(first.id)
      return
    }
    toggleExpand()
    return
  }
  if (isSelfHosted.value) {
    if (playing.value) pauseSelf()
    else playSelf()
    if (!expanded.value) expanded.value = true
    return
  }
  // Suno: play button expands/collapses (embed owns transport)
  toggleExpand()
}

function prev() {
  if (!props.tracks.length) return
  const i = activeIndex.value < 0 ? 0 : (activeIndex.value - 1 + props.tracks.length) % props.tracks.length
  select(props.tracks[i].id)
}

function next() {
  if (!props.tracks.length) return
  const i = activeIndex.value < 0 ? 0 : (activeIndex.value + 1) % props.tracks.length
  select(props.tracks[i].id)
}

function seek(evt) {
  if (!isSelfHosted.value || !audioEl.value || !duration.value) return
  const el = progressRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = Math.min(Math.max(evt.clientX - rect.left, 0), rect.width)
  const pct = rect.width ? x / rect.width : 0
  audioEl.value.currentTime = pct * duration.value
  currentTime.value = audioEl.value.currentTime
  progressPct.value = pct * 100
}

function onKeySeek(evt) {
  if (!isSelfHosted.value || !audioEl.value) return
  const step = evt.shiftKey ? 10 : 5
  if (evt.key === 'ArrowRight') {
    audioEl.value.currentTime = Math.min(duration.value, (audioEl.value.currentTime || 0) + step)
    onTimeUpdate()
  } else if (evt.key === 'ArrowLeft') {
    audioEl.value.currentTime = Math.max(0, (audioEl.value.currentTime || 0) - step)
    onTimeUpdate()
  }
}

onMounted(() => {
  reduce.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  try {
    muted.value = localStorage.getItem(MUTE_KEY) === '1'
  } catch { /* ignore */ }
  applyMute()
  const types = ['pointerdown', 'keydown', 'touchstart']
  const opts = { capture: true, passive: true }
  types.forEach((t) => window.addEventListener(t, onFirstGesture, opts))
  removeGestureListeners = () => {
    types.forEach((t) => window.removeEventListener(t, onFirstGesture, opts))
  }
})

onBeforeUnmount(() => {
  removeGestureListeners()
  pauseSelf()
  stopEqLoop()
  if (audioCtx) {
    try { audioCtx.close() } catch { /* ignore */ }
    audioCtx = null
    sourceNode = null
    analyser = null
  }
})

watch(() => props.tracks, (list) => {
  if (list.length) tryStartBed()
})
</script>

<template>
  <aside
    class="mp"
    :class="{ 'is-expanded': expanded, 'is-live': Boolean(active), 'is-playing': playing }"
    aria-label="Music player"
  >
    <audio
      ref="audioEl"
      preload="metadata"
      crossorigin="anonymous"
      :muted="muted"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMeta"
      @ended="onEnded"
      @play="playing = true"
      @pause="playing = false"
    />

    <!-- Compact dock (always visible) -->
    <div class="mp__dock">
      <button type="button" class="mp__cover-btn" :aria-expanded="expanded" :aria-controls="'mp-panel'" :aria-label="expanded ? 'Collapse music player' : 'Open music player'" @click="toggleExpand">
        <img
          v-if="active?.image"
          class="mp__cover"
          :src="active.image"
          :alt="active.title + ' cover'"
          width="48"
          height="48"
        />
        <span v-else class="mp__cover mp__cover--empty" aria-hidden="true" />
        <span class="mp__eq" :class="{ 'is-on': (playing && isSelfHosted) || (active && expanded && isSuno) }" aria-hidden="true">
          <i v-for="(h, i) in eqHeights" :key="i" :style="{ height: h + 'px' }" />
        </span>
      </button>

      <div class="mp__meta">
        <p class="mp__title">{{ active?.title || 'Listen · nicsins' }}</p>
        <p class="mp__sub">
          <span class="mp__time">{{ displayTime }}</span>
          <span class="mp__dot" aria-hidden="true">·</span>
          <span>{{ active?.style || 'Pick a track' }}</span>
        </p>
        <div
          ref="progressRef"
          class="mp__progress"
          :class="{ 'is-seekable': isSelfHosted }"
          role="slider"
          :aria-valuemin="0"
          :aria-valuemax="Math.floor(duration) || 0"
          :aria-valuenow="Math.floor(currentTime)"
          :aria-label="isSelfHosted ? 'Seek' : 'Progress'"
          :tabindex="isSelfHosted ? 0 : -1"
          @click="seek"
          @keydown="onKeySeek"
        >
          <span
            class="mp__progress-bar"
            :class="{ 'is-on': active && expanded && isSuno && !isSelfHosted, 'is-live': isSelfHosted }"
            :style="isSelfHosted ? { width: progressPct + '%', animation: 'none' } : undefined"
          />
        </div>
      </div>

      <div class="mp__controls">
        <button type="button" class="mp__ctrl" aria-label="Previous track" @click="prev">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M11 2v10L4.5 7 11 2zM3 2v10" fill="currentColor"/></svg>
        </button>
        <button
          type="button"
          class="mp__play"
          :aria-label="isSelfHosted ? (playing ? 'Pause' : 'Play') : (expanded && active ? 'Collapse player' : 'Open player')"
          @click="togglePlay"
        >
          <svg v-if="isSelfHosted ? !playing : !(expanded && active)" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M5 3.5v9l8-4.5-8-4.5z" fill="currentColor"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 3h3v10H4V3zm5 0h3v10H9V3z" fill="currentColor"/>
          </svg>
        </button>
        <button type="button" class="mp__ctrl" aria-label="Next track" @click="next">
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 2v10l6.5-5L3 2zm8 0v10" fill="currentColor"/></svg>
        </button>
        <button
          type="button"
          class="mp__ctrl mp__mute"
          :aria-pressed="muted"
          :aria-label="muted ? 'Unmute' : 'Mute'"
          @click="toggleMute"
        >
          <svg v-if="!muted" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 6h3l3-3v10L5 10H2V6zm8.2 1a2.8 2.8 0 0 1 0 2L9 8.2A1.4 1.4 0 0 0 9 7.8l1.2-.8zM11.8 4.8a5 5 0 0 1 0 6.4l-1-.8a3.7 3.7 0 0 0 0-4.8l1-.8z" fill="currentColor"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 6h3l3-3v10L5 10H2V6zm12.2.1-1.1 1.1-1.1-1.1-.8.8 1.1 1.1-1.1 1.1.8.8 1.1-1.1 1.1 1.1.8-.8-1.1-1.1 1.1-1.1-.8-.8z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Expanded panel -->
    <div v-show="expanded" id="mp-panel" class="mp__panel">
      <div class="mp__list" role="listbox" aria-label="Tracks">
        <button
          v-for="track in tracks"
          :key="track.id"
          type="button"
          role="option"
          class="mp__track"
          :class="{ 'is-active': track.id === activeId }"
          :aria-selected="track.id === activeId"
          @click="select(track.id)"
        >
          <img class="mp__track-art" :src="track.image" alt="" width="40" height="40" />
          <span class="mp__track-text">
            <span class="mp__track-time">{{ track.time }}</span>
            <span class="mp__track-title">{{ track.title }}</span>
            <span class="mp__track-style">{{ track.style }}{{ track.songUrl || track.embedUrl ? ' · Suno' : ' · local' }}</span>
          </span>
        </button>
      </div>

      <div class="mp__stage">
        <template v-if="active && isSuno">
          <iframe
            :key="active.id"
            class="mp__embed"
            :title="active.title + ' on Suno'"
            :src="active.embedUrl"
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
          />
          <p class="mp__foot">
            <span>Played from Suno. nicsins.</span>
            <a :href="active.songUrl" target="_blank" rel="noopener noreferrer">Open the song ↗</a>
          </p>
        </template>
        <template v-else-if="active && isSelfHosted">
          <div class="mp__local">
            <img class="mp__local-art" :src="active.image" :alt="active.title + ' cover'" width="160" height="160" />
            <div class="mp__local-meta">
              <p class="mp__local-title">{{ active.title }}</p>
              <p class="mp__local-style">{{ active.style }}</p>
              <p class="mp__local-time">
                <span class="mp__time">{{ formatTime(currentTime) }}</span>
                <span class="mp__dot">/</span>
                <span class="mp__time">{{ formatTime(duration || 0) }}</span>
              </p>
              <div class="mp__eq mp__eq--stage" :class="{ 'is-on': playing }" aria-hidden="true">
                <i v-for="(h, i) in eqHeights" :key="'s'+i" :style="{ height: (h * 2) + 'px' }" />
              </div>
            </div>
          </div>
          <p class="mp__foot" v-if="isSunoStream">
            <span>Played from Suno. nicsins.</span>
            <a :href="active.songUrl || active.embedUrl" target="_blank" rel="noopener noreferrer">Open the song ↗</a>
          </p>
          <p class="mp__foot" v-else>
            <span>Self-hosted · Grok-made · nicsins.</span>
            <a :href="active.src" download>Download ↗</a>
          </p>
        </template>
        <p v-else class="mp__empty">Pick a title. The player loads then.</p>
      </div>

      <p class="mp__credit">
        The first two tracks are the default instrumental bed from
        <a :href="profile" target="_blank" rel="noopener noreferrer">suno.com/@nicsins</a>.
        They start on your first click and loop unless you pick another title.
      </p>
    </div>
  </aside>
</template>

<style scoped>
.mp {
  position: fixed;
  right: max(16px, env(safe-area-inset-right));
  bottom: max(16px, env(safe-area-inset-bottom));
  z-index: 50;
  width: min(420px, calc(100vw - 32px));
  border: 1px solid var(--ns-border);
  border-radius: var(--ns-r-lg);
  background: var(--ns-surface);
  box-shadow: var(--ns-shadow-2);
  overflow: hidden;
  transition: width var(--ns-slow) var(--ns-ease), border-color var(--ns-med) var(--ns-ease);
}
.mp.is-expanded {
  width: min(720px, calc(100vw - 24px));
  border-color: var(--ns-border-strong);
}
.mp__dock {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  min-height: 68px;
}
.mp__cover-btn {
  position: relative;
  width: 48px; height: 48px;
  border-radius: var(--ns-r-sm);
  overflow: hidden;
  flex-shrink: 0;
  padding: 0;
}
.mp__cover {
  width: 48px; height: 48px; object-fit: cover; display: block;
  border-radius: var(--ns-r-sm);
}
.mp__cover--empty {
  display: block; background: var(--ns-surface-2);
  border: 1px dashed var(--ns-border-strong);
}
.mp__eq {
  position: absolute; left: 4px; bottom: 4px;
  display: flex; align-items: flex-end; gap: 2px; height: 12px;
  opacity: 0.35;
}
.mp__eq.is-on { opacity: 1; }
.mp__eq i {
  display: block; width: 2px; background: var(--ns-accent);
  border-radius: 1px; height: 4px;
  transform-origin: bottom;
  transition: height 60ms linear;
}
.mp__eq.is-on i.is-css-anim,
.mp.is-live:not(.is-playing) .mp__eq.is-on i {
  animation: eq 0.9s ease-in-out infinite alternate;
}
.mp:not(.is-playing) .mp__eq.is-on i {
  animation: eq 0.9s ease-in-out infinite alternate;
}
.mp__eq i:nth-child(1) { animation-delay: 0s; }
.mp__eq i:nth-child(2) { animation-delay: 0.12s; }
.mp__eq i:nth-child(3) { animation-delay: 0.24s; }
.mp__eq i:nth-child(4) { animation-delay: 0.08s; }
.mp__eq i:nth-child(5) { animation-delay: 0.3s; }
.mp.is-playing .mp__eq.is-on i {
  animation: none;
}
@keyframes eq {
  from { transform: scaleY(0.45); }
  to { transform: scaleY(1); }
}
.mp__eq--stage {
  position: static;
  height: 28px;
  gap: 4px;
  margin-top: 12px;
  opacity: 0.5;
}
.mp__eq--stage.is-on { opacity: 1; }
.mp__eq--stage i {
  width: 4px;
  min-height: 4px;
}
.mp__meta { min-width: 0; }
.mp__title {
  margin: 0;
  font: 600 var(--ns-fs-sm)/1.2 var(--ns-font-body);
  color: var(--ns-text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mp__sub {
  margin: 4px 0 0;
  font: 400 11px/1.3 var(--ns-font-body);
  color: var(--ns-muted);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mp__time { font-family: var(--ns-font-mono); font-variant-numeric: tabular-nums; }
.mp__dot { margin: 0 4px; color: var(--ns-faint); }
.mp__progress {
  margin-top: 8px; height: 3px; border-radius: 2px;
  background: var(--ns-border); overflow: hidden;
}
.mp__progress.is-seekable {
  height: 6px;
  cursor: pointer;
}
.mp__progress.is-seekable:focus-visible {
  outline: 2px solid var(--ns-accent);
  outline-offset: 2px;
}
.mp__progress-bar {
  display: block; height: 100%; width: 0%;
  background: var(--ns-accent); border-radius: 2px;
  transition: width 80ms linear;
}
.mp__progress-bar.is-on {
  width: 100%;
  animation: prog 8s linear infinite;
}
.mp__progress-bar.is-live {
  transition: width 80ms linear;
}
@keyframes prog {
  from { width: 8%; }
  to { width: 92%; }
}
.mp__controls { display: flex; align-items: center; gap: 4px; }
.mp__ctrl {
  width: 32px; height: 32px;
  display: inline-flex; align-items: center; justify-content: center;
  color: var(--ns-muted); border-radius: var(--ns-r-sm);
}
.mp__ctrl:hover { color: var(--ns-text); background: var(--ns-surface-2); }
.mp__play {
  width: 40px; height: 40px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--ns-accent); color: var(--ns-accent-ink);
  transition: background var(--ns-fast) var(--ns-ease), transform var(--ns-fast) var(--ns-ease);
}
.mp__play:hover { background: var(--ns-accent-hover); }
.mp__play:active { transform: translateY(1px); }

.mp__panel {
  border-top: 1px solid var(--ns-border);
  display: grid;
  grid-template-columns: minmax(180px, 260px) 1fr;
  gap: 0;
  max-height: min(56vh, 460px);
  animation: panel-in var(--ns-slow) var(--ns-ease);
}
@keyframes panel-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.mp__list {
  border-right: 1px solid var(--ns-border);
  overflow: auto;
  max-height: inherit;
}
.mp__track {
  width: 100%;
  display: flex; gap: 10px; align-items: center;
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--ns-border);
  background: transparent;
  transition: background var(--ns-fast) var(--ns-ease);
}
.mp__track:hover { background: var(--ns-surface-2); }
.mp__track.is-active { background: var(--ns-surface); box-shadow: inset 2px 0 0 var(--ns-accent); }
.mp__track-art {
  width: 40px; height: 40px; border-radius: 6px; object-fit: cover; flex-shrink: 0;
}
.mp__track-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.mp__track-time {
  font: 500 10px/1 var(--ns-font-mono);
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--ns-accent);
}
.mp__track-title {
  font: 600 var(--ns-fs-sm)/1.2 var(--ns-font-body); color: var(--ns-text);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mp__track-style { font-size: 11px; color: var(--ns-muted); }
.mp__stage {
  display: flex; flex-direction: column; min-height: 220px; background: var(--ns-surface);
}
.mp__embed {
  width: 100%; flex: 1; min-height: 180px; border: 0; background: #000;
}
.mp__local {
  flex: 1;
  display: flex; gap: 20px; align-items: center;
  padding: 24px;
  min-height: 200px;
}
.mp__local-art {
  width: 140px; height: 140px; border-radius: var(--ns-r-md);
  object-fit: cover;
  box-shadow: var(--ns-shadow-1);
  border: 1px solid var(--ns-border);
}
.mp__local-meta { min-width: 0; }
.mp__local-title {
  margin: 0;
  font: 600 var(--ns-fs-lg)/1.2 var(--ns-font-display);
  color: var(--ns-text);
}
.mp__local-style {
  margin: 6px 0 0;
  font: 400 var(--ns-fs-sm)/1.3 var(--ns-font-body);
  color: var(--ns-muted);
}
.mp__local-time {
  margin: 14px 0 0;
  font: 500 var(--ns-fs-sm)/1 var(--ns-font-mono);
  color: var(--ns-accent);
}
.mp__foot {
  margin: 0;
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px;
  padding: 10px 14px;
  font: 400 var(--ns-fs-xs)/1.4 var(--ns-font-body);
  color: var(--ns-muted);
  border-top: 1px solid var(--ns-border);
}
.mp__foot a { color: var(--ns-text); text-underline-offset: 3px; }
.mp__foot a:hover { color: var(--ns-accent); }
.mp__empty {
  margin: auto; padding: 24px;
  font: 500 var(--ns-fs-md)/1.3 var(--ns-font-display);
  color: var(--ns-muted); text-align: center; font-style: italic;
}
.mp__credit {
  grid-column: 1 / -1;
  margin: 0;
  padding: 8px 14px;
  border-top: 1px solid var(--ns-border);
  font: 400 10px/1.4 var(--ns-font-mono);
  color: var(--ns-faint);
}
.mp__credit a { color: var(--ns-muted); }
@media (max-width: 640px) {
  .mp { right: 12px; bottom: 12px; width: calc(100vw - 24px); }
  .mp.is-expanded { width: calc(100vw - 24px); }
  .mp__panel { grid-template-columns: 1fr; max-height: 60vh; }
  .mp__list { border-right: 0; border-bottom: 1px solid var(--ns-border); max-height: 160px; }
  .mp__local { flex-direction: column; text-align: center; padding: 16px; }
  .mp__eq--stage { justify-content: center; }
}
@media (prefers-reduced-motion: reduce) {
  .mp__eq.is-on i, .mp__progress-bar.is-on { animation: none !important; }
  .mp, .mp__panel { transition: none; animation: none; }
  .mp__progress-bar.is-on { width: 40%; }
}
</style>
