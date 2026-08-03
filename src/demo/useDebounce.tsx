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

const DEBOUNCE_SECONDS = 3 // 防抖秒数，同时也是倒计时长度

export default function UseDebounceHook() {
    const [count, setCount] = useState(0)
    const [remaining, setRemaining] = useState(0) // 剩余秒数，0 表示无待触发的防抖
    const debouncedCount = useDebounce(count, DEBOUNCE_SECONDS * 1000)

    // 每次点击：计数 +1，并重置倒计时（防抖会把弹窗推迟）
    const handleClick = () => {
        setCount(prev => prev + 1)
        setRemaining(DEBOUNCE_SECONDS)
    }

    // 倒计时：每秒递减，归零后停止
    useEffect(() => {
        if (remaining <= 0) return
        const id = setInterval(() => {
            setRemaining(prev => prev - 1)
        }, 1000)
        return () => clearInterval(id)
    }, [remaining])

    // 防抖结束（停止点击 DEBOUNCE_SECONDS 秒）后弹窗
    useEffect(() => {
        if (debouncedCount > 0) {
            alert(`你共点击了 ${debouncedCount} 次`)
        }
    }, [debouncedCount])

    return (
        <div className='flex w-full gap-4 items-center justify-center'>
            <div className='bg-emerald-400 h-40 w-80 border-4 shadow-xl border-emerald-700 rounded-2xl flex flex-col items-center justify-center gap-2 px-6 py-4'>
                <button
                    type='button'
                    className='rounded-xl cursor-pointer border border-black bg-white px-6 py-3 font-bold text-emerald-700 shadow transition hover:bg-emerald-50 active:scale-95'
                    onClick={handleClick}
                >
                    点击（防抖 {DEBOUNCE_SECONDS} 秒）
                </button>
                {remaining > 0 && (
                    <div className='font-bold text-white'>还剩 {remaining} 秒后弹窗</div>
                )}
                <div className='font-bold text-white'>
                    已点 {count} 次 · 防抖输出 {debouncedCount} 次
                </div>
            </div>
            <div className='flex flex-col gap-2 w-[40%] h-full border-4 shadow-xl border-emerald-700 rounded-2xl px-6 py-4'>
                <div className='text-justify'>
                    所谓防抖，就是说当你连续点击按钮时，只有在你停止点击一段时间后，才会触发弹窗。这个时间就是防抖的延迟时间。在这个示例中，我们设置了一个 3 秒的防抖时间，也就是说，如果你在 3 秒内连续点击按钮，弹窗不会立即出现，而是会等到你停止点击 3 秒后才会弹出，显示你总共点击了多少次。
                </div>
                <div className='text-justify font-bold'>
                    一个非常好理解的案例就是游戏中的回城，无论你触发多少次回城，它总是以你最后一次触发的时间为准，而不是立即执行。
                </div>
            </div>

        </div>
    )
}
