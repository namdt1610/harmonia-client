import { useDebounce } from '@/hooks/useDebounce'

export function DebounceTestComponent({ value, delay }: { value: string; delay: number }) {
  const debounced = useDebounce(value, delay)
  return <div data-testid="debounced-value">{debounced}</div>
}
