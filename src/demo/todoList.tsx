import React, { useState } from 'react'

interface ItemProps {
    id: number
    finish: boolean
    content: string
    handleClickFinish: (id: number) => void
}

type EventProps = Omit<ItemProps, 'handleClickFinish'>

const Item = ({ id, finish, content, handleClickFinish }: ItemProps) => {
    return (
        <div className='flex items-center justify-start gap-1 w-[80%] h-8 p-2'>
            <button
                type='button'
                className={`h-4 w-4 cursor-pointer rounded-full border-2 ${finish ? 'border-green-600 bg-green-500' : 'border-gray-500 bg-white'}`}
                onClick={() => handleClickFinish(id)}
            ></button>
            <div>{content}</div>
        </div >
    )
}

export default function TodoList() {
    const [events, setEvents] = useState<EventProps[]>([
        { id: 1, finish: false, content: 'Task 1' },
        { id: 2, finish: false, content: 'Task 2' },
        { id: 3, finish: false, content: 'Task 3' },
    ])

    const handleClickFinish = (id: number) => {
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.id === id) {
                return { ...event, finish: !event.finish }
            }
            return event
        }))
    }
    return (
        <div className=' flex-col h-[40%] w-[40%] border-4 shadow-xl border-emerald-700 rounded-2xl flex items-center justify-center px-6 py-4'>
            <h1 className='font-bold text-4xl'>Todo List</h1>
            {events.map(event => (
                <Item
                    key={event.id}
                    id={event.id}
                    finish={event.finish}
                    content={event.content}
                    handleClickFinish={handleClickFinish}
                />
            ))}
        </div>
    )
}
