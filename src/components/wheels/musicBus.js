import { ref } from 'vue'

/** 0..1 average music energy for subtle UI reactions (preview border, etc.) */
export const musicEnergy = ref(0)
export const musicPlaying = ref(false)
