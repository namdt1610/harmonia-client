import { useEffect, useState } from 'react'
/**
 * Hook delay giá trị đầu vào và chỉ trả về khi ổn định sau khoảng delay.

 * @param value - Giá trị đầu vào (thường là input)
 * @param delay - Độ trễ tính bằng ms (mặc định: 300)
 * @returns Giá trị đã debounce
 */
export function useDebounce<T>(value: T, delay: number): T{
      const [debounce, setDebounce] = useState<T>(value)

      useEffect(() => {
            const timer = setTimeout(() => {
                  setDebounce(value)
            },delay)
            return () => clearTimeout(timer)
      },[delay, value])
      
      return debounce
}
