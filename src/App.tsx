import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { demoEntries } from './registry/demos'

function App() {
    const defaultPath = `/${demoEntries[0].key}`

    return (
        <HashRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    {/* 默认跳转到第一个 Demo */}
                    <Route index element={<Navigate to={defaultPath} replace />} />
                    {/* 由注册容器自动生成路由，无需手动维护 */}
                    {demoEntries.map(entry => (
                        <Route key={entry.key} path={entry.key} element={<entry.component />} />
                    ))}
                    {/* 未知路径回到第一个 Demo */}
                    <Route path='*' element={<Navigate to={defaultPath} replace />} />
                </Route>
            </Routes>
        </HashRouter>
    )
}

export default App