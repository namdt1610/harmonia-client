import React from 'react'
import { render, screen } from '@testing-library/react'
import { DebounceTestComponent } from '@/components/test/DebounceTestComponent'
import { act } from 'react'

jest.useFakeTimers()

describe('useDebounce hook', () => {
  it('trả về giá trị ban đầu ngay lập tức', () => {
    render(<DebounceTestComponent value="hello" delay={500} />)
    expect(screen.getByTestId('debounced-value')).toHaveTextContent('hello')
  })

  it('update giá trị sau delay', () => {
    const { rerender } = render(<DebounceTestComponent value="A" delay={500} />)

    rerender(<DebounceTestComponent value="B" delay={500} />)

    expect(screen.getByTestId('debounced-value')).toHaveTextContent('A')

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(screen.getByTestId('debounced-value')).toHaveTextContent('B')
  })

  it('reset timer nếu value thay đổi nhanh', () => {
    const { rerender } = render(<DebounceTestComponent value="1" delay={500} />)

    act(() => jest.advanceTimersByTime(200))
    rerender(<DebounceTestComponent value="2" delay={500} />)

    act(() => jest.advanceTimersByTime(200))
    rerender(<DebounceTestComponent value="3" delay={500} />)

    act(() => jest.advanceTimersByTime(400)) // chưa đủ delay
    expect(screen.getByTestId('debounced-value')).toHaveTextContent('1')

    act(() => jest.advanceTimersByTime(100)) // đủ 500ms từ "3"
    expect(screen.getByTestId('debounced-value')).toHaveTextContent('3')
  })
})
