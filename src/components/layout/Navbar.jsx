import React from 'react';
import useAppStore from '../../store/useStore';

const Navbar = () => {
    const { user, role } = useAppStore();

    return (
        <nav className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-0 z-40 md:left-64 flex items-center justify-between px-6 transition-all duration-300" style={{ left: 'var(--sidebar-width, 16rem)' }}>
            <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">CRM Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-semibold text-slate-700">{user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500">{role || 'Agent'}</p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
