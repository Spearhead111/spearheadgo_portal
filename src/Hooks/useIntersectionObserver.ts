import { ref, onBeforeUnmount, onMounted, type Ref } from 'vue'

export interface IntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

export interface UseIntersectionObserverResult {
  isIntersecting: Ref<boolean>
}

const useIntersectionObserver = (
  targetRef: Ref<Element | null>,
  options?: IntersectionObserverOptions
): UseIntersectionObserverResult => {
  const isIntersecting = ref(false)
  let observer: IntersectionObserver | null = null

  const callback: IntersectionObserverCallback = (entries) => {
    const entry = entries[0]
    isIntersecting.value = entry.isIntersecting
  }

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  onMounted(() => {
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(callback, options)
      if (targetRef.value) {
        observer.observe(targetRef.value)
      }
    }
  })

  return { isIntersecting }
}

export default useIntersectionObserver
