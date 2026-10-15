import { useCallback, useRef, useState } from 'react'

// ---------------- 自定义 Hook：useUpdate ----------------

/**
 * useUpdate：手动触发一次重新渲染
 *
 * 调用返回的 update()，组件就会重新渲染一次，值本身没有任何意义。
 *
 * 两个关键点：
 *  1. 靠 setUpdate(prev => prev + 1) 让 state 发生变化。React 只认「值变了」，
 *     写回同一个数字的话它会直接跳过这次更新，所以这里用递增而不是 setUpdate(0)。
 *     用 useReducer 写 dispatch({ type: 'update' }) 是同一个套路。
 *  2. 用 useCallback 把 update 的引用固定住（依赖数组是空的），
 *     这样它可以安全地写进其它 Hook 的依赖数组、或者当 props 往下传，
 *     不会因为每次渲染都是新函数而把下游的 effect 反复触发。
 *
 * 什么时候需要它？数据没有放在 state 里的时候 —— 存在 useRef、类的实例、
 * 第三方库或浏览器 API 里的可变数据，改完它们 React 不知道，界面不会更新，
 * 这时喊一声 update() 把最新值刷到页面上。数据本来就在 state 里的话，
 * 直接 setState 就好，别用它。
 */
function useUpdate() {
    const [, setUpdate] = useState(0)

    const update = useCallback(() => {
        setUpdate(prev => prev + 1)
    }, [])

    return update
}

// ---------------- 使用示例 ----------------

const INITIAL_STOCK = 5 // 初始库存

export default function UseUpdateHook() {
    // 库存存在 ref 里：它不是 state，改它 React 完全不知情，界面不会跟着变
    const stockRef = useRef(INITIAL_STOCK)
    // 渲染次数也记在 ref 里，同样只在真正渲染时才看得出来
    const renderCountRef = useRef(0)
    renderCountRef.current += 1

    const update = useUpdate()

    // 入库 / 出库：只改 ref 里的数字，一次渲染都不会触发，页面纹丝不动
    const handleAdd = () => {
        stockRef.current += 1
    }

    const handleRemove = () => {
        stockRef.current = Math.max(0, stockRef.current - 1)
    }

    // 强制刷新：调用 update()，组件重新渲染，ref 里的最新值才被刷到页面上
    const handleRefresh = () => {
        update()
    }

    // 偷看：直接读 ref，拿到的是此刻真实的值，和页面显示的可能对不上
    const handlePeek = () => {
        alert(`ref 里的真实库存是 ${stockRef.current}，页面上显示的还是上次渲染的值`)
    }

    return (
        <div className='flex w-full gap-4 items-center justify-center'>
            {/* 中间：Hook 的效果区 */}
            <div className='bg-emerald-400 h-80 w-80 border-4 shadow-xl border-emerald-700 rounded-2xl flex flex-col items-center justify-center gap-3 px-6 py-4'>
                <div className='text-6xl font-black text-white tabular-nums'>
                    {stockRef.current}
                </div>
                <div className='font-bold text-white'>页面显示：上次渲染时的库存</div>

                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={handleAdd}
                        className='rounded-xl cursor-pointer border border-black bg-white px-4 py-2 font-bold text-emerald-700 shadow transition hover:bg-emerald-50 active:scale-95'
                    >
                        入库 +1
                    </button>
                    <button
                        type='button'
                        onClick={handleRemove}
                        className='rounded-xl cursor-pointer border border-black bg-white px-4 py-2 font-bold text-emerald-700 shadow transition hover:bg-emerald-50 active:scale-95'
                    >
                        出库 -1
                    </button>
                </div>

                <button
                    type='button'
                    onClick={handleRefresh}
                    className='rounded-xl cursor-pointer border border-black bg-emerald-700 px-6 py-2 font-bold text-white shadow transition hover:bg-emerald-800 active:scale-95'
                >
                    强制刷新 useUpdate()
                </button>

                <div className='flex items-center gap-2'>
                    <span className='font-bold text-white'>
                        已渲染 {renderCountRef.current} 次
                    </span>
                    <button
                        type='button'
                        onClick={handlePeek}
                        className='rounded-lg cursor-pointer border border-black bg-white px-2 py-1 text-sm font-bold text-emerald-700 shadow transition hover:bg-emerald-50 active:scale-95'
                    >
                        偷看 ref
                    </button>
                </div>
            </div>

            {/* 右侧：说明区 */}
            <div className='flex flex-col gap-2 w-[40%] h-full border-4 shadow-xl border-emerald-700 rounded-2xl px-6 py-4'>
                <div className='text-justify'>
                    useUpdate 干的事情很朴素：返回一个 update
                    函数，调用它就强制组件重新渲染一次。点上边的「入库 / 出库」，数字只改在 ref
                    里 —— ref 不是 state，React 根本不知道它变了，所以页面上的库存一动不动；再点「强制刷新
                    useUpdate()」，组件重新渲染，ref 里的最新值才被刷到页面上。
                </div>
                <div className='text-justify'>
                    实现上它就是自己维护一个数字 state，update 的时候 +1。为什么是 +1
                    而不是写回 0？因为 React 判断「要不要更新」看的是值有没有变，
                    写回同一个数字会被直接跳过。再用 useCallback
                    把函数引用固定住，它就能安全地放进别的依赖数组、或者当 props 传下去。
                </div>
                <div className='text-justify font-bold'>
                    它是个逃生舱，不是常规手段：只有在数据不归 React 管的时候才用得上 ——
                    存在 useRef、类实例、第三方库或浏览器 API 里的可变数据，改完需要手动喊一声。
                    数据本来就在 state 里，直接 setState 就行，硬用 useUpdate
                    只会白白多渲染一次，也容易掩盖真正的数据流问题。
                </div>
            </div>
        </div>
    )
}