import { useEffect, useRef, useState } from 'react'

// ---------------- 自定义 Hook：useTimeout ----------------

/**
 * useTimeout：setTimeout 的 Hook 版
 *
 * 在 delay 毫秒后执行一次 callback，执行完就结束了（一次性，不是 setInterval）。
 *
 * 两个关键点：
 *  1. 回调存进 ref。callback 每次渲染都是新函数，直接写进依赖数组的话，
 *     组件随便一次重渲染都会把定时器拆掉重建，永远等不到触发；存进 ref 后
 *     定时器只在 delay 变化时重建，而触发那一刻取到的仍是最新一次渲染的回调，
 *     顺带绕开了闭包只能读到旧 state 的坑。
 *  2. 在 effect 的清理函数里 clearTimeout。delay 变化或组件卸载时旧定时器不会继续跑，
 *     否则组件都没了回调还在执行，很容易报「对已卸载组件 setState」。
 *
 * delay 传 null / undefined 表示「这次不启动」，配合清理函数就能实现中途取消。
 */
function useTimeout(callback: () => void, delay?: number | null) {
    const savedCallback = useRef(() => {})

    // 每次渲染后同步最新回调，更新 ref 不会触发重渲染
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        if (typeof delay !== 'number') {
            return
        }

        const timerId = setTimeout(() => savedCallback.current(), delay)

        return () => clearTimeout(timerId)
    }, [delay])
}

// ---------------- 使用示例 ----------------

const FUSE_SECONDS = 3 // 引线长度，同时也是倒计时长度

export default function UseTimeoutHook() {
    const [lit, setLit] = useState(false) // 引线是否点燃
    const [remaining, setRemaining] = useState(0) // 剩余秒数，0 表示未点燃
    const [booms, setBooms] = useState(0) // 已引爆次数

    // 点燃后 FUSE_SECONDS 秒执行一次；delay 传 null 表示这次不启动
    useTimeout(
        () => {
            setBooms(n => n + 1)
            setLit(false)
            setRemaining(0)
            alert(`引线烧完 ${FUSE_SECONDS} 秒，爆炸！`)
        },
        lit ? FUSE_SECONDS * 1000 : null
    )

    // 点燃：delay 从 null 变成数字，effect 重新执行，定时器启动
    const handleLight = () => {
        setLit(true)
        setRemaining(FUSE_SECONDS)
    }

    // 熄灭：delay 变回 null，effect 的清理函数会 clearTimeout
    const handleExtinguish = () => {
        setLit(false)
        setRemaining(0)
    }

    // 倒计时显示：每秒递减，归零后停止
    useEffect(() => {
        if (!lit || remaining <= 0) return
        const id = setInterval(() => {
            setRemaining(prev => Math.max(0, prev - 1))
        }, 1000)
        return () => clearInterval(id)
    }, [lit, remaining])

    return (
        <div className='flex w-full gap-4 items-center justify-center'>
            {/* 中间：Hook 的效果区 */}
            <div className='bg-emerald-400 h-80 w-80 border-4 shadow-xl border-emerald-700 rounded-2xl flex flex-col items-center justify-center gap-3 px-6 py-4'>
                <div className='text-6xl font-black text-white tabular-nums'>
                    {lit ? remaining : '--'}
                </div>
                <div className='font-bold text-white'>{lit ? '秒后引爆' : '引线未点燃'}</div>

                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={handleLight}
                        disabled={lit}
                        className='rounded-xl cursor-pointer border border-black bg-white px-4 py-2 font-bold text-emerald-700 shadow transition hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        点燃引线（{FUSE_SECONDS} 秒）
                    </button>
                    <button
                        type='button'
                        onClick={handleExtinguish}
                        disabled={!lit}
                        className='rounded-xl cursor-pointer border border-black bg-white px-4 py-2 font-bold text-emerald-700 shadow transition hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        熄灭
                    </button>
                </div>

                <div className='font-bold text-white'>已引爆 {booms} 次</div>
            </div>

            {/* 右侧：说明区 */}
            <div className='flex flex-col gap-2 w-[40%] h-full border-4 shadow-xl border-emerald-700 rounded-2xl px-6 py-4'>
                <div className='text-justify'>
                    useTimeout 就是把 setTimeout 包成一个 Hook：在 delay
                    毫秒后执行一次回调，执行完就结束了，不像 setInterval 那样反复触发。
                    这个示例里点燃引线后，delay 从 null 变成 {FUSE_SECONDS * 1000}
                    ，effect 重新执行，定时器随之启动；熄灭则是把 delay 变回 null，
                    清理函数 clearTimeout 把还没触发的定时器清掉。
                </div>
                <div className='text-justify'>
                    为什么要多用一个 useRef 存回调？因为组件每次重渲染都会生成新的函数，
                    直接把它写进依赖数组的话，定时器会被反复拆掉重建，永远等不到触发。
                    存进 ref 后，定时器只在 delay 变化时才重建，而触发那一刻取到的又始终是
                    最新一次渲染的回调，闭包只能读到旧 state 的坑也一并绕开了。
                </div>
                <div className='text-justify font-bold'>
                    就像炸弹的引线：点燃后开始倒计时，到点只炸一次。注意 delay
                    没变时 effect 不会重新执行，所以点燃状态下是点不了第二次的 ——
                    真要支持「重新计时」，得让 Hook 额外返回一个 reset，用一个递增的
                    nonce 当依赖把定时器重开。
                </div>
            </div>
        </div>
    )
}