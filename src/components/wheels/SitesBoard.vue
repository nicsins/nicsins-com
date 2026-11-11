<script setup>
import { computed, onMounted, ref } from 'vue'
import NetworkCanvas from './NetworkCanvas.vue'
import SiteWheel from './SiteWheel.vue'
import PreviewWindow from './PreviewWindow.vue'

const props = defineProps({
  compact: { type: Boolean, default: false },
})

const categories = ref([])
const activeSite = ref(null)
const previewOrigin = ref(null)
const loadError = ref('')

const flatSites = computed(() =>
  categories.value.flatMap((c) => c.sites.map((s) => ({ ...s, category: c.id }))),
)

function selectSite(site, origin) {
  if (origin && typeof origin.x === 'number') {
    previewOrigin.value = { x: origin.x, y: origin.y }
  } else {
    previewOrigin.value = {
      x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
      y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    }
  }
  activeSite.value = site
}
function closePreview() {
  activeSite.value = null
  previewOrigin.value = null
}

onMounted(async () => {
  try {
    const res = await fetch('/sites.json')
    const data = await res.json()
    categories.value = data.categories || []
  } catch (e) {
    loadError.value = String(e)
  }
})
</script>

<template>
  <div class="board" :class="{ 'is-compact': compact }">
    <div class="board__net" aria-hidden="true">
      <NetworkCanvas
        :sites="flatSites"
        :active-id="activeSite?.id || null"
        @select="selectSite"
      />
    </div>
    <div class="board__ui">
      <p v-if="loadError" class="board__err" role="alert">Failed to load sites: {{ loadError }}</p>
      <div class="board__wheels" role="region" aria-label="Site category wheels">
        <SiteWheel
          v-for="cat in categories"
          :key="cat.id"
          :category="cat"
          :active-id="activeSite?.id || null"
          @select="selectSite"
        />
      </div>
    </div>
    <PreviewWindow
      v-if="activeSite"
      :site="activeSite"
      :origin="previewOrigin"
      @close="closePreview"
    />
  </div>
</template>

<style scoped>
.board {
  position: relative;
  isolation: isolate;
  min-height: 360px;
}
.board__net {
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0.7;
  pointer-events: none;
  mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%);
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 18%, #000 82%, transparent 100%);
}
.board__net :deep(.net) {
  position: absolute;
  inset: 0;
}
.board__net :deep(.net__canvas) {
  pointer-events: auto;
}
.board__ui {
  position: relative;
  z-index: 1;
}
.board__wheels {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: stretch;
}
.board__err {
  color: var(--ns-dev);
  font: 400 var(--ns-fs-sm)/1.4 var(--ns-font-mono);
}
@media (max-width: 720px) {
  .board__wheels { flex-direction: column; }
  .board__net { opacity: 0.35; }
}
</style>
