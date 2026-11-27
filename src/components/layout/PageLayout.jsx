import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import useAppStore from '../../store/useStore'
import { cn } from '../../lib/utils'
import { useLocation, Outlet } from 'react-router-dom'

const PageLayout = () => {
    const { sidebarCollapsed } = useAppStore()
    const location = useLocation()
    const isChatPage = location.pathname.includes('/inbox')

    return (
        <div className="flex h-screen bg-[#111318] overflow-hidden text-white">
            <Sidebar />
            
            <div className={cn(
                "flex-1 flex flex-col min-w-0 transition-all duration-300",
                sidebarCollapsed ? "md:ml-20" : "md:ml-72"
            )}>
                <Topbar />
                
                <main className="flex-1 overflow-y-auto h-full">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default PageLayout
