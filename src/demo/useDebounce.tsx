import React, { useState, useEffect } from 'react'

// 泛型拓展了防抖传入值类型，不只局限于回调函数
function useDebounce<T>(value: T, delay = 1000) {
    const [debouncedValue, setDebouncedValue] = useState(value)
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    return debouncedValue
}

export default function UseDebounceHook() {
    const [count, setCount] = useState(0)
    const debouncedCount = useDebounce(count, 1000)

    useEffect(() => {
        if (debouncedCount > 0) {
            alert(`你共点击了 ${debouncedCount} 次`)
        }
    }, [debouncedCount])

    const handleClick = () => {
        setCount(prev => prev + 1)
    }

    return (
        <div className='bg-emerald-400 h-40 w-80 border-4 shadow-xl border-emerald-700 rounded-2xl flex items-center justify-center px-6 py-4'>
            <button
                type='button'
                className='rounded-xl cursor-pointer border border-black bg-white px-6 py-3 font-bold text-emerald-700 shadow transition hover:bg-emerald-50 active:scale-95'
                onClick={handleClick}
            >
                点击{debouncedCount > 0 && ` · 已点 ${debouncedCount} 次`}
            </button>
        </div>
    )
}
