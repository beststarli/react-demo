import type { ReactNode } from 'react'
import { Code2 } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { demoEntries } from '../registry/demos'

const tokenStyles = [
    {
        pattern: /^<\/?[A-Z][\w.]*/,
        className: 'text-[#4ec9b0]',
    },
    {
        pattern: /^<\/?[a-z][\w-]*/,
        className: 'text-[#569cd6]',
    },
    {
        pattern: /^('[^']*'|"[^"]*"|`[^`]*`)/,
        className: 'text-[#ce9178]',
    },
    {
        pattern: /^(import|from|export|default|function|const|let|var|return|interface|type|extends|if|else|true|false|null|undefined)\b/,
        className: 'text-[#c586c0]',
    },
    {
        pattern: /^(useState|useEffect|React|ComponentType|Omit)\b/,
        className: 'text-[#4ec9b0]',
    },
    {
        pattern: /^[A-Z][A-Za-z0-9_]*/,
        className: 'text-[#4ec9b0]',
    },
    {
        pattern: /^[a-zA-Z_$][\w$]*(?=\s*:)/,
        className: 'text-[#9cdcfe]',
    },
    {
        pattern: /^[a-zA-Z_$][\w$]*(?=\s*\()/,
        className: 'text-[#dcdcaa]',
    },
    {
        pattern: /^\d+/,
        className: 'text-[#b5cea8]',
    },
]

function renderHighlightedLine(line: string) {
    const tokens: ReactNode[] = []
    let index = 0

    while (index < line.length) {
        const currentText = line.slice(index)
        const tokenStyle = tokenStyles.find(style => style.pattern.test(currentText))
        const matchedText = tokenStyle?.pattern.exec(currentText)?.[0]

        if (!tokenStyle || !matchedText) {
            tokens.push(line[index])
            index += 1
            continue
        }

        tokens.push(
            <span key={`${index}-${matchedText}`} className={tokenStyle.className}>
                {matchedText}
            </span>,
        )
        index += matchedText.length
    }

    return tokens
}

export default function AppLayout() {
    const { pathname } = useLocation()
    const activeKey = pathname.split('/').filter(Boolean)[0]
    const activeDemo = demoEntries.find(entry => entry.key === activeKey) ?? demoEntries[0]
    const sourceLines = activeDemo.sourceCode.trimEnd().split('\n')

    return (
        <div className='flex h-screen w-screen overflow-hidden bg-background'>
            {/* 左栏：Demo 菜单 */}
            <aside className='flex w-[10%] shrink-0 flex-col border-r border-border bg-sidebar'>
                <div className='flex items-center justify-between border-b border-sidebar-border px-4 py-4'>
                    <span className='text-xl font-semibold text-sidebar-foreground'>
                        React Demos
                    </span>
                    <a
                        href='https://github.com/beststarli'
                        target='_blank'
                        rel='noreferrer'
                        title='beststarli'
                        className='shrink-0'
                    >
                        <img
                            src='/beststar.png'
                            alt='beststar'
                            className='size-10 border-2 border-black rounded-full object-cover transition-opacity hover:opacity-80'
                        />
                    </a>
                </div>
                <nav className='flex-1 space-y-1 overflow-y-auto p-2'>
                    {demoEntries.map(entry => (
                        <NavLink
                            key={entry.key}
                            to={`/${entry.key}`}
                            className={({ isActive }) =>
                                `block rounded-md px-3 py-2 transition-colors ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                }`
                            }
                        >
                            <div className='text-sm font-medium'>{entry.name}</div>
                            {entry.description && (
                                <div className='mt-0.5 text-xs opacity-70'>
                                    {entry.description}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* 中间栏：当前 Demo 组件效果区 */}
            <main className='flex min-w-0 flex-1 items-center justify-center overflow-auto bg-background p-8'>
                <Outlet />
            </main>

            {/* 右栏：当前 Demo 组件源码 */}
            <aside className='flex w-[45%] shrink-0 flex-col border-l border-[#2d2d2d] bg-[#1e1e1e] text-[#d4d4d4]'>
                <div className='flex h-[61px] items-center border-b border-[#2d2d2d] bg-[#181818]'>
                    <div className='flex h-full items-center gap-2 border-r border-[#2d2d2d] bg-[#1e1e1e] px-4 text-sm text-[#cccccc]'>
                        <Code2 className='size-4 text-[#75beff]' />
                        <span>{activeDemo.name}.tsx</span>
                    </div>
                </div>
                <div className='min-h-0 flex-1 overflow-auto bg-[#1e1e1e] p-5 font-mono text-[13px] leading-6'>
                    <pre className='m-0 min-w-max'>
                        <code>
                            {sourceLines.map((line, index) => (
                                <span key={`${activeDemo.key}-${index}`} className='flex min-h-6'>
                                    <span className='w-10 shrink-0 select-none pr-5 text-right text-[#858585]'>
                                        {index + 1}
                                    </span>
                                    <span className='whitespace-pre text-[#d4d4d4]'>
                                        {line ? renderHighlightedLine(line) : ' '}
                                    </span>
                                </span>
                            ))}
                        </code>
                    </pre>
                </div>
            </aside>
        </div>
    )
}
