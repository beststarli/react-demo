import type { ComponentType } from 'react'
import CountDown from '../demo/countDown'
import countDownCode from '../demo/countDown?raw'
import TodoList from '../demo/todoList'
import todoListCode from '../demo/todoList?raw'
import UseDebounceHook from '../demo/useDebounce'
import useDebounceCode from '../demo/useDebounce?raw'
import UseThrottleHook from '../demo/useThrottle'
import useThrottleCode from '../demo/useThrottle?raw'

export interface DemoEntry {
    /** 唯一标识，同时作为路由路径（建议 kebab-case，如 'my-demo'） */
    key: string
    /** 左栏菜单显示的名称 */
    name: string
    /** 菜单项下方的简短描述（可选） */
    description?: string
    /** 中间效果栏要挂载的 Demo 组件 */
    component: ComponentType
    /** 右侧代码栏显示的组件源码 */
    sourceCode: string
}

/**
 * Demo 组件注册容器
 *
 * 写完一个新组件后，只需在下面数组里追加一项即可：
 *
 *     import MyDemo from '../demo/myDemo'
 *     ...
 *     import myDemoCode from '../demo/myDemo?raw'
 *     ...
 *     { key: 'my-demo', name: 'MyDemo', description: '我的新示例', component: MyDemo, sourceCode: myDemoCode },
 *
 * 注册后会自动完成两件事：
 *   1. 左栏菜单出现对应菜单项
 *   2. 中间效果栏挂载该组件
 *   3. 右侧代码栏显示该组件源码
 */
export const demoEntries: DemoEntry[] = [
    {
        key: 'countdown',
        name: 'CountDown',
        description: '倒计时组件',
        component: CountDown,
        sourceCode: countDownCode,
    },
    {
        key: 'todolist',
        name: 'TodoList',
        description: '一个简单的TodoList',
        component: TodoList,
        sourceCode: todoListCode,
    },
    {
        key: 'useDebounce',
        name: 'useDebounce',
        description: '自定义防抖钩子函数useDebounce',
        component: UseDebounceHook,
        sourceCode: useDebounceCode,
    },
    {
        key: 'useThrottle',
        name: 'useThrottle',
        description: '自定义节流钩子函数useThrottle',
        component: UseThrottleHook,
        sourceCode: useThrottleCode,
    },
]
