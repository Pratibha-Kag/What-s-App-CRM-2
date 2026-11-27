import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Menu } from 'lucide-react';
import AIChatWidget from '../AIChatWidget';
import useAppStore from '../../store/useStore';
import { DEFAULT_BRANDING } from '../../lib/brandingUtils';

const PublicLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { branding } = useAppStore();
    const activeBranding = { ...DEFAULT_BRANDING, ...(branding || {}) };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/contact', label: 'Contact & Apply' }
    ];

    return (
        <div className="min-h-screen bg-[#050812] font-sans flex flex-col selection:bg-indigo-500/30">
            {/* Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 bg-[#0a0f1c]/80 backdrop-blur-md border-b border-white/10 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-24">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <Link to="/" className="flex items-center gap-2.5 text-xl sm:text-2xl font-black text-white tracking-tight hover:text-indigo-400 transition-colors">
                                {activeBranding.logoDataUrl && (
                                    <img
                                        src={activeBranding.logoDataUrl}
                                        alt={`${activeBranding.appName} logo`}
                                        className="h-8 w-8 rounded-lg object-contain bg-white/5 p-0.5 shrink-0"
                                    />
                                )}
                                <span>{activeBranding.appName || 'WhatsApp CRM'}</span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.path} 
                                    to={link.path}
                                    className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                                        location.pathname === link.path ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link to="/login" className="px-6 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">
                                Portal Login
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button 
                            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Nav */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden bg-[#0a0f1c] border-b border-white/10 overflow-hidden"
                        >
                            <div className="px-4 py-4 flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <Link 
                                        key={link.path} 
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`text-[11px] font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-colors ${
                                            location.pathname === link.path ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Link 
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)} 
                                    className="px-4 py-3 mt-2 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-500 text-center shadow-lg shadow-indigo-600/20"
                                >
                                    Portal Login
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 pt-24">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-[#050812] text-slate-400 py-16 border-t border-slate-800/50 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-slate-800/50 pb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="mb-8 flex items-center gap-3">
                                {activeBranding.logoDataUrl && (
                                    <img
                                        src={activeBranding.logoDataUrl}
                                        alt={`${activeBranding.appName} logo`}
                                        className="h-8 w-8 rounded-lg object-contain bg-white/5 p-0.5 shrink-0"
                                    />
                                )}
                                <span className="text-xl font-black text-white tracking-tight">{activeBranding.appName || 'WhatsApp CRM'}</span>
                            </div>
                            <p className="text-sm font-medium leading-relaxed max-w-sm mb-6 text-slate-400">
                                Empowering global education through intelligent software. We streamline the admissions process for students and institutions worldwide.
                            </p>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-6">Platform</h4>
                            <ul className="space-y-4 text-xs font-bold tracking-wide">
                                <li><Link to="/" className="hover:text-white transition-colors">Product Overview</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Apply Now</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Counselor Portal</Link></li>
                                <li><Link to="#" className="hover:text-white transition-colors">Student Dashboard</Link></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-6">Contact</h4>
                            <ul className="space-y-4 text-xs font-bold tracking-wide">
                                <li className="flex items-center gap-2 hover:text-white transition-colors"><Bot size={14} className="text-emerald-500" /> support@whatsappcrm.com</li>
                                <li className="flex items-center gap-2 hover:text-white transition-colors"><Send size={14} className="text-emerald-500" /> +1 (555) 123-4567</li>
                                <li className="flex items-center gap-2 hover:text-white transition-colors">Global Headquarters</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <p>&copy; {new Date().getFullYear()} WhatsApp CRM. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating AI Chat Widget */}
            <AIChatWidget />
        </div>
    );
};

export default PublicLayout;
