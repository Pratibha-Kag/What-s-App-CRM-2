import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import useAppStore from '../../store/useStore'
import { cn } from '../../lib/utils'
import { Outlet } from 'react-router-dom'

const PageLayout = () => {
    const { sidebarCollapsed, mobileMenuOpen } = useAppStore()

    return (
        <div className="flex h-[100dvh] w-full bg-[#111318] overflow-hidden text-white pt-safe pb-safe">
            <Sidebar />

            <div
                className={cn(
                    "flex-1 flex flex-col min-w-0 w-full transition-all duration-300",
                    sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
                )}
            >
                <Topbar />

                <main
                    className={cn(
                        "flex-1 min-w-0 h-full overflow-x-hidden",
                        mobileMenuOpen ? "overflow-hidden lg:overflow-y-auto" : "overflow-y-auto"
                    )}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default PageLayout
