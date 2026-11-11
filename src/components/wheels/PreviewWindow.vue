<script setup>
/**
 * Site preview dialog. Iframes only when the host is known to allow framing
 * from this origin (`frame: open`). `nicsins` (frame-ancestors limited to
 * nicsins.com), `deny`, and `none` fall back to a card with a thumbnail.
 * If an "open" frame is blocked or times out, the card is shown instead.
 * Border is a mint hairline — no rainbow glow (style guide: one accent, no second hue).
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  site: { type: Object, required: true },
  origin: { type: Object, default: null },
})
const emit = defineEmits(['close'])

const framePolicy = computed(() => props.site?.frame || 'open')
const canTryFrame = computed(() =>
  Boolean(props.site?.href) && framePolicy.value === 'open' && !userForceCard.value,
)
const nicsinsOnly = computed(() => framePolicy.value === 'nicsins')
const frameOk = ref(true)
const loading = ref(true)
const reduce = ref(false)
const userForceCard = ref(false)
let timeoutId = 0

const showCard = computed(() =>
  !canTryFrame.value || !frameOk.value || userForceCard.value,
)

const fallbackNote = computed(() => {
  if (!props.site?.href) return 'This one is not on a public URL yet.'
  if (nicsinsOnly.value) return 'Live preview is reserved for nicsins.com (frame-ancestors). Open the site instead.'
  if (framePolicy.value === 'deny') return 'This host does not allow framing. Open it in a new tab.'
  if (!frameOk.value || userForceCard.value) return 'Preview could not be framed, so here is a card instead.'
  return ''
})

function onKey(e) {
  if (e.key === 'Escape') emit('close')
}
function onLoad() {
  loading.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = 0
  }
}
function onError() {
  frameOk.value = false
  loading.value = false
}

function armTimeout() {
  if (timeoutId) clearTimeout(timeoutId)
  // If the frame never loads (XFO/CSP), fall back rather than spin.
  timeoutId = window.setTimeout(() => {
    if (loading.value && canTryFrame.value) {
      frameOk.value = false
      loading.value = false
    }
  }, 4000)
}

onMounted(() => {
  reduce.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.addEventListener('keydown', onKey)
  if (canTryFrame.value) armTimeout()
  else loading.value = false
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  if (timeoutId) clearTimeout(timeoutId)
})
watch(() => props.site?.id, () => {
  userForceCard.value = false
  frameOk.value = true
  loading.value = canTryFrame.value
  if (canTryFrame.value) armTimeout()
})
</script>

<template>
  <div class="pv" role="dialog" aria-modal="true" :aria-labelledby="'pv-title'">
    <button type="button" class="pv__backdrop" aria-label="Close preview" @click="emit('close')" />
    <div class="pv__shell" :class="{ 'is-reduce': reduce }">
      <div class="pv__panel">
        <div class="pv__bar">
          <div class="pv__dots" aria-hidden="true"><span /><span /><span /></div>
          <p id="pv-title" class="pv__url">{{ site.host || site.name }}</p>
          <div class="pv__actions">
            <a
              v-if="site.href"
              class="pv__ext"
              :href="site.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Open ${site.name}`"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3h7v7h-1.5V5.56L4.53 12.5 3.5 11.47 10.44 4.5H6V3z" fill="currentColor"/></svg>
            </a>
            <button type="button" class="pv__close" aria-label="Close preview" @click="emit('close')">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.2 3.1 8 6.9l3.8-3.8 1.1 1.1L9.1 8l3.8 3.8-1.1 1.1L8 9.1l-3.8 3.8-1.1-1.1L6.9 8 3.1 4.2l1.1-1.1z" fill="currentColor"/></svg>
            </button>
          </div>
        </div>
        <div class="pv__body">
          <template v-if="!showCard">
            <p v-if="loading" class="pv__loading">Loading preview…</p>
            <iframe
              class="pv__frame"
              :title="`${site.name} preview`"
              :src="site.href"
              referrerpolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              @load="onLoad"
              @error="onError"
            />
            <button type="button" class="pv__fallback-btn" @click="userForceCard = true">Show card instead</button>
          </template>
          <article v-else class="pv__card" :class="{ 'pv__card--dev': site.status === 'dev' || site.status === 'preview' }">
            <span
              class="ns-badge"
              :class="(site.status === 'dev' || site.status === 'preview') ? 'ns-badge--dev' : 'ns-badge--live'"
            >{{ site.tag || (site.status === 'dev' ? 'In development' : 'Live') }}</span>
            <img v-if="site.thumb" class="pv__thumb" :src="site.thumb" :alt="`${site.name} snapshot`" width="640" height="400" />
            <h3 class="pv__title">{{ site.name }}</h3>
            <p class="pv__desc">{{ site.desc }}</p>
            <p v-if="site.host" class="pv__meta">{{ site.host }}</p>
            <p v-if="fallbackNote" class="pv__meta">{{ fallbackNote }}</p>
            <a v-if="site.href" class="ns-btn ns-btn--primary" :href="site.href" target="_blank" rel="noopener noreferrer">
              Open site ↗
            </a>
            <button
              v-if="framePolicy === 'open' && site.href && (!frameOk || userForceCard)"
              type="button"
              class="pv__retry"
              @click="userForceCard = false; frameOk = true; loading = true; armTimeout()"
            >Try live preview</button>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pv {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
}
.pv__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(10, 12, 15, 0.8);
  border: 0;
  padding: 0;
  cursor: pointer;
}
.pv__shell {
  position: relative;
  z-index: 1;
  width: min(960px, calc(100vw - 32px));
  height: min(72vh, 680px);
  max-height: calc(100vh - 32px);
  opacity: 0;
  animation: pv-in var(--ns-slow) var(--ns-ease) forwards;
}
.pv__shell.is-reduce { animation: none; opacity: 1; }
@keyframes pv-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.pv__panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--ns-surface);
  border: 1px solid var(--ns-accent);
  border-radius: var(--ns-r-lg);
  box-shadow: var(--ns-shadow-2);
  overflow: hidden;
}
.pv__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 14px;
  border-bottom: 1px solid var(--ns-border);
  background: var(--ns-surface);
  flex-shrink: 0;
}
.pv__dots { display: flex; gap: 6px; }
.pv__dots span {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--ns-border-strong);
}
.pv__url {
  margin: 0;
  flex: 1;
  font: 400 var(--ns-fs-xs)/1 var(--ns-font-mono);
  color: var(--ns-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pv__actions { display: flex; gap: 4px; }
.pv__ext, .pv__close {
  width: 36px; height: 36px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: var(--ns-r-sm);
  color: var(--ns-muted);
  text-decoration: none;
  transition: color var(--ns-fast) var(--ns-ease), background var(--ns-fast) var(--ns-ease);
}
.pv__ext:hover, .pv__close:hover { color: var(--ns-text); background: var(--ns-surface-2); }
.pv__ext { color: var(--ns-accent); }
.pv__body { position: relative; flex: 1; background: var(--ns-bg); min-height: 0; }
.pv__frame { width: 100%; height: 100%; border: 0; background: #fff; }
.pv__loading {
  position: absolute; inset: 0; display: grid; place-items: center;
  font: 400 var(--ns-fs-sm)/1 var(--ns-font-mono); color: var(--ns-muted);
  background: var(--ns-bg); z-index: 1;
}
.pv__fallback-btn {
  position: absolute; bottom: 12px; left: 12px; z-index: 2;
  height: 32px; padding: 0 12px;
  border-radius: var(--ns-r-pill);
  border: 1px solid var(--ns-border);
  background: var(--ns-surface);
  color: var(--ns-muted);
  font: 500 11px/1 var(--ns-font-mono);
}
.pv__retry {
  margin-top: 8px;
  height: 36px; padding: 0 14px; width: fit-content;
  border-radius: var(--ns-r-md);
  border: 1px solid var(--ns-border-strong);
  background: transparent;
  color: var(--ns-accent);
  font: 500 12px/1 var(--ns-font-mono);
}
.pv__card {
  height: 100%;
  padding: clamp(24px, 5vw, 48px);
  display: flex; flex-direction: column; gap: 12px; justify-content: center;
  overflow: auto;
}
.pv__card--dev { border-top: 1px dashed var(--ns-dev); }
.pv__thumb {
  width: min(100%, 420px);
  height: auto;
  border-radius: var(--ns-r-md);
  border: 1px solid var(--ns-border);
  object-fit: cover;
}
.pv__title {
  margin: 0;
  font: 600 var(--ns-fs-xl)/1.15 var(--ns-font-display);
  letter-spacing: -0.015em;
}
.pv__desc { margin: 0; color: var(--ns-muted); max-width: 42ch; }
.pv__meta {
  margin: 0;
  font: 400 var(--ns-fs-xs)/1.4 var(--ns-font-mono);
  color: var(--ns-faint);
}
.ns-badge {
  display: inline-flex; align-items: center; gap: 6px;
  height: 22px; padding: 0 9px; width: fit-content;
  border-radius: var(--ns-r-pill);
  font: 500 11px/1 var(--ns-font-mono); letter-spacing: 0.04em;
}
.ns-badge--live {
  color: var(--ns-accent); background: var(--ns-accent-wash);
  border: 1px solid rgba(79,209,181,0.25);
}
.ns-badge--live::before {
  content: ""; width: 6px; height: 6px; border-radius: 50%; background: currentColor;
}
.ns-badge--dev {
  color: var(--ns-dev); background: var(--ns-dev-wash);
  border: 1px solid rgba(194,180,138,0.22);
}
.ns-badge--dev::before {
  content: ""; width: 6px; height: 6px; border-radius: 50%; border: 1.5px solid currentColor;
}
.ns-btn {
  display: inline-flex; align-items: center; gap: 8px;
  height: 44px; padding: 0 20px; width: fit-content;
  border-radius: var(--ns-r-md);
  font: 600 var(--ns-fs-sm)/1 var(--ns-font-body);
  text-decoration: none; border: 1px solid transparent;
}
.ns-btn--primary { background: var(--ns-accent); color: var(--ns-accent-ink); }
.ns-btn--primary:hover { background: var(--ns-accent-hover); }
@media (max-width: 640px) {
  .pv { padding: 12px; }
  .pv__shell {
    width: min(100%, calc(100vw - 24px));
    height: min(78vh, 720px);
    max-height: calc(100dvh - 24px);
  }
}
@media (prefers-reduced-motion: reduce) {
  .pv__shell { animation: none !important; opacity: 1 !important; }
}
</style>
