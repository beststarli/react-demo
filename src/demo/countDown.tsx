import React, { useState, useEffect } from 'react'

export default function CountDown() {
    const initialTime = 10
    const [count, setCount] = useState(initialTime)

    useEffect(() => {
        if (count < 0) {
            setCount(10)
        }
        const id = setInterval(() => {
            setCount(prev => prev - 1)
        }, 1000)
        return () => {
            clearInterval(id)
        }
    }, [count])

    return (
        <div className='bg-emerald-400 h-40 w-80 border-4 shadow-xl border-emerald-700 rounded-2xl flex items-center justify-center px-6 py-4'>
            <div className='font-bold text-4xl text-white'>{count}</div>
        </div>
    )
}
