import { onMounted, onUnmounted } from 'vue'

export function useScrollObserver() {
    const observerCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in')
                observer.unobserve(entry.target) // Only animate once
            }
        })
    }

    onMounted(() => {
        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.1, // Trigger when 10% of the element is visible
            rootMargin: '50px', // Trigger slightly before it enters
        })

        const elements = document.querySelectorAll('.animate-on-scroll')
        elements.forEach((el) => observer.observe(el))
    })
}
