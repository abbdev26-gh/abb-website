<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

const props = defineProps({
  to: {
    type: [Number, String],
    required: true
  },
  duration: {
    type: Number,
    default: 2000
  }
})

const elementRef = ref<HTMLElement | null>(null)
const currentDisplay = ref('0')
const hasAnimated = ref(false)

// Parse the input to separate number from potential suffix (e.g. "100+" -> 100 and "+")
const parsed = computed(() => {
  const str = String(props.to)
  const numberMatch = str.match(/[\d,.]+/)
  const number = numberMatch ? parseFloat(numberMatch[0].replace(/,/g, '')) : 0
  const suffix = str.replace(/[\d,.]+/, '')
  return { number, suffix }
})

const animate = () => {
  if (hasAnimated.value) return
  hasAnimated.value = true

  const startTimestamp = performance.now()
  const startValue = 0
  const endValue = parsed.value.number

  const step = (timestamp: number) => {
    const progress = Math.min((timestamp - startTimestamp) / props.duration, 1)
    
    // Ease out quart
    const easeProgress = 1 - Math.pow(1 - progress, 4)
    
    const currentValue = Math.floor(startValue + (endValue - startValue) * easeProgress)
    currentDisplay.value = currentValue.toLocaleString() + parsed.value.suffix

    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate()
        observer.disconnect()
      }
    })
  }, { threshold: 0.5 })

  if (elementRef.value) {
    observer.observe(elementRef.value)
  }
})
</script>

<template>
  <span ref="elementRef">{{ currentDisplay }}</span>
</template>
