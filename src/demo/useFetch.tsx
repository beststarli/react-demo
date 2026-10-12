import { useCallback, useEffect, useRef, useState } from 'react'

// ---------------- 自定义 Hook：useFetch ----------------

export interface UseFetchResult<T> {
    /** 请求成功后的数据，未完成时为 null */
    data: T | null
    /** 是否正在请求中 */
    loading: boolean
    /** 请求失败时的错误对象 */
    error: Error | null
    /** 手动重新发起一次请求 */
    refetch: () => void
}

export interface UseFetchOptions extends RequestInit {
    /** 额外依赖：数组里任意一项变化都会自动重新请求（等价于 useEffect 的依赖项） */
    deps?: unknown[]
    /** 是否在挂载时立即请求，默认 true；为 false 时只能靠 refetch 手动触发 */
    immediate?: boolean
}

/**
 * useFetch：把「发请求 + 管状态 + 清理副作用」这套重复逻辑封装成一个 Hook
 *
 * 三个关键点：
 *  1. 用 useState 保存 data / loading / error 三件套，组件里只关心渲染
 *  2. 用 AbortController 在卸载或依赖变化时取消上一次请求，避免竞态和内存泄漏
 *  3. 用 ref 存请求配置，避免 options 每次渲染都是新对象而导致的无限请求
 */
function useFetch<T>(url: string, options: UseFetchOptions = {}): UseFetchResult<T> {
    const { deps = [], immediate = true, ...init } = options

    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(immediate)
    const [error, setError] = useState<Error | null>(null)
    // nonce 只在 refetch 时 +1，用它当作 effect 的依赖来重新触发请求
    const [nonce, setNonce] = useState(0)

    // 请求配置放进 ref：options 每次渲染都是新对象，不能直接当依赖
    const initRef = useRef(init)
    initRef.current = init

    useEffect(() => {
        // immediate 为 false 且没手动 refetch 过，就什么都不做
        if (!immediate && nonce === 0) return

        // 每次请求都新建一个 controller，用于取消这次请求
        const controller = new AbortController()
        let cancelled = false // 标记本次请求是否已经作废（依赖变了 / 组件卸载了）

        setLoading(true)
        setError(null)

        fetch(url, { ...initRef.current, signal: controller.signal })
            .then(res => {
                // fetch 只有网络异常才 reject，HTTP 4xx/5xx 需要自己判断
                if (!res.ok) throw new Error(`请求失败：${res.status} ${res.statusText}`)
                const contentType = res.headers.get('content-type') ?? ''
                return contentType.includes('application/json') ? res.json() : res.text()
            })
            .then(result => {
                if (cancelled) return
                setData(result as T)
            })
            .catch(err => {
                // 主动取消产生的 AbortError 不算错误，直接忽略
                if (cancelled || (err as Error).name === 'AbortError') return
                setError(err as Error)
            })
            .finally(() => {
                if (cancelled) return
                setLoading(false)
            })

        // 清理函数：依赖变化或组件卸载时，取消这次还没回来的请求
        return () => {
            cancelled = true
            controller.abort()
        }
        // deps 由调用方传入，故意展开进依赖数组
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, nonce, immediate, ...deps])

    const refetch = useCallback(() => setNonce(n => n + 1), [])

    return { data, loading, error, refetch }
}

// ---------------- 使用示例 ----------------

const API = 'https://jsonplaceholder.typicode.com/posts'

interface Post {
    id: number
    userId: number
    title: string
    body: string
}

export default function UseFetchHook() {
    const [postId, setPostId] = useState(1)
    // url 变化（postId 变了）会自动重新请求，也可以点按钮 refetch 手动重发
    const { data, loading, error, refetch } = useFetch<Post>(`${API}/${postId}`)

    const goPrev = () => setPostId(id => Math.max(1, id - 1))
    const goNext = () => setPostId(id => Math.min(100, id + 1))

    return (
        <div className='flex w-full gap-4 items-center justify-center'>
            {/* 中间：Hook 的效果区 */}
            <div className='bg-emerald-400 h-80 w-80 border-4 shadow-xl border-emerald-700 rounded-2xl flex flex-col items-center justify-center gap-3 px-6 py-4'>
                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={goPrev}
                        disabled={postId === 1}
                        className='rounded-xl cursor-pointer border border-black bg-white px-4 py-2 font-bold text-emerald-700 shadow transition hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        上一篇
                    </button>
                    <span className='font-bold text-white'>#{postId}</span>
                    <button
                        type='button'
                        onClick={goNext}
                        disabled={postId === 100}
                        className='rounded-xl cursor-pointer border border-black bg-white px-4 py-2 font-bold text-emerald-700 shadow transition hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        下一篇
                    </button>
                </div>

                <button
                    type='button'
                    onClick={refetch}
                    className='rounded-xl cursor-pointer border border-black bg-white px-6 py-2 font-bold text-emerald-700 shadow transition hover:bg-emerald-50 active:scale-95'
                >
                    重新请求 refetch()
                </button>

                {/* 根据 loading / error / data 三种状态渲染不同内容 */}
                <div className='w-full flex-1 overflow-auto rounded-xl bg-white/80 p-3 text-sm text-emerald-900'>
                    {loading && <div className='font-bold'>加载中…</div>}

                    {!loading && error && (
                        <div className='font-bold text-red-600'>出错了：{error.message}</div>
                    )}

                    {!loading && !error && data && (
                        <div className='flex flex-col gap-1'>
                            <div className='font-bold'>userId: {data.userId}</div>
                            <div className='font-bold'>title: {data.title}</div>
                            <div className='line-clamp-4'>{data.body}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* 右侧：说明区 */}
            <div className='flex flex-col gap-2 w-[40%] h-full border-4 shadow-xl border-emerald-700 rounded-2xl px-6 py-4'>
                <div className='text-justify'>
                    所谓自定义 Hook，就是把组件里重复的“状态 + 副作用”逻辑抽到一个以 use
                    开头的函数里。useFetch 是其中最典型的一个：它内部用 useState 维护 data /
                    loading / error 三个状态，用 useEffect 发请求，最后把结果返回给组件。
                </div>
                <div className='text-justify'>
                    调用方只需要关心 url 和怎么渲染，不用再自己写 loading、异常处理和清理逻辑。
                </div>
                <div className='text-justify font-bold'>
                    两个容易踩的坑：一是请求未回来组件就卸载了（要用 AbortController
                    取消，避免对已卸载组件 setState）；二是快速切换参数时后发的请求先返回，导致旧数据覆盖新数据（竞态），所以每次请求都要有一份自己的
                    cancelled 标记。
                </div>
            </div>
        </div>
    )
}
