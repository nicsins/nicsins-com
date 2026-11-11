<script setup>
import { onMounted, ref } from 'vue'
import MusicPlayer from './MusicPlayer.vue'

const tracks = ref([])
const profile = ref('https://suno.com/@nicsins')

onMounted(async () => {
  try {
    const res = await fetch('/playlist.json')
    const data = await res.json()
    tracks.value = data.tracks || []
    if (data.profile) profile.value = data.profile
  } catch {
    tracks.value = []
  }
})
</script>

<template>
  <MusicPlayer v-if="tracks.length" :tracks="tracks" :profile="profile" />
</template>
