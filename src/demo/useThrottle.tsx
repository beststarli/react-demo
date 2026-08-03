import React, { useState, useEffect, useRef } from 'react'

// 泛型拓展了节流传入值类型，不只局限于回调函数
function useThrottle<T>(value: T, limit = 1000) {
    const [throttledValue, setThrottledValue] = useState(value)
    const lastRunRef = useRef(0)

    useEffect(() => {
        const now = Date.now()
        // 如果距离上次执行时间超过了限制时间，则立即执行
        if (now - lastRunRef.current >= limit) {
            setThrottledValue(value)
            lastRunRef.current = now
            return
        }

        // 否则，设置一个定时器，在限制时间后执行
        const remainingTime = limit - (now - lastRunRef.current)
        const timer = setTimeout(() => {
            lastRunRef.current = Date.now()
            setThrottledValue(value)
        }, remainingTime)

        return () => {
            clearTimeout(timer)
        }
    }, [value, limit])

    return throttledValue
}

const THROTTLE_SECONDS = 5 // 节流秒数，即冷却窗口长度

export default function UseThrottleHook() {
    const [count, setCount] = useState(0) // 实时点击次数
    const [remaining, setRemaining] = useState(0) // 冷却倒计时，0 表示无冷却
    const throttledCount = useThrottle(count, THROTTLE_SECONDS * 1000) // 节流后的输出

    // 节流触发（首触或末尾）后弹窗，并重新开始冷却倒计时
    useEffect(() => {
        if (throttledCount > 0) {
            alert(`节流触发：已点击 ${throttledCount} 次`)
            setRemaining(THROTTLE_SECONDS)
        }
    }, [throttledCount])

    // 冷却倒计时：每秒递减，归零后停止
    useEffect(() => {
        if (remaining <= 0) return
        const id = setInterval(() => {
            setRemaining(prev => Math.max(0, prev - 1))
        }, 1000)
        return () => clearInterval(id)
    }, [remaining])

    // 点击不会重置冷却，只会被节流吸收
    const handleClick = () => {
        setCount(prev => prev + 1)
    }

    return (
        <div className='flex w-full gap-4 items-center justify-center'>
            <div className='bg-emerald-400 h-40 w-80 border-4 shadow-xl border-emerald-700 rounded-2xl flex flex-col items-center justify-center gap-2 px-6 py-4'>
                <button
                    type='button'
                    className='rounded-xl cursor-pointer border border-black bg-white px-6 py-3 font-bold text-emerald-700 shadow transition hover:bg-emerald-50 active:scale-95'
                    onClick={handleClick}
                >
                    点击（节流 {THROTTLE_SECONDS} 秒）
                </button>
                {remaining > 0 && (
                    <div className='font-bold text-white'>剩 {remaining} 秒后可再触发</div>
                )}
                <div className='font-bold text-white'>
                    已点 {count} 次 · 节流输出 {throttledCount} 次
                </div>
            </div>
            <div className='flex flex-col gap-2 w-[40%] h-full border-4 shadow-xl border-emerald-700 rounded-2xl px-6 py-4'>
                <div className='text-justify'>
                    所谓节流，就是说当你连续点击按钮时，只有在你停止点击一段时间后，才会触发弹窗。这个时间就是节流的冷却时间。在这个示例中，我们设置了一个 5 秒的节流时间，也就是说，如果你在 5 秒内连续点击按钮，弹窗不会立即出现，而是会等到你停止点击 5 秒后才会弹出，显示你总共点击了多少次。
                </div>
                <div className='text-justify font-bold'>
                    一个非常好理解的案例就是游戏中的技能冷却时间，当释放过技能后，在冷却中无论你触发多少次技能，它总是以你上次释放技能，即最初触发后的时间为准开始计时，而不是立即执行。
                </div>
            </div>
        </div>
    )
}
