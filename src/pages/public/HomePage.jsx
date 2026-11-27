import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Globe2, GraduationCap, CheckCircle2, ArrowRight, Bot, Zap, MessageSquare, Target, Shield, Users, Facebook, Smartphone, MousePointerClick, BrainCircuit, Activity, BarChart3, Clock, Sparkles, TrendingUp, Bell, Star } from 'lucide-react';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const HomePage = () => {
    const navigate = useNavigate();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="w-full bg-[#050812] text-slate-300 overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* --- DENSE HERO SECTION --- */}
            <section className="relative min-h-[110vh] pt-32 pb-10 flex items-center justify-center overflow-hidden">
                {/* Dynamic Mouse-Following Glow */}
                <div 
                    className="absolute w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none transition-transform duration-1000 ease-out"
                    style={{ transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)` }}
                />

                {/* Dense Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_30%,transparent_100%)]"></div>
                
                {/* Multiple Background Orbs to kill empty space */}
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[80px] mix-blend-screen" />

                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
                        
                        {/* LEFT COLUMN: Hero Text & Floating Elements */}
                        <motion.div 
                            initial="hidden" animate="visible" variants={staggerContainer}
                            className="text-left space-y-8 relative"
                        >
                            {/* Floating Avatar 1 */}
                            <motion.div 
                                animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }} transition={{ duration: 6, repeat: Infinity }}
                                className="absolute -top-12 right-20 bg-slate-800/80 backdrop-blur-md p-2 rounded-2xl border border-slate-700/50 shadow-2xl hidden md:flex items-center gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 p-[2px]">
                                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center"><Users size={14} className="text-white"/></div>
                                </div>
                                <div className="pr-2">
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">New Lead</p>
                                    <p className="text-xs font-black text-white">Rahul Sharma</p>
                                </div>
                            </motion.div>

                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                Intelligent Admissions Engine v3.0
                            </motion.div>
                            
                            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-[72px] font-black text-white tracking-tight leading-[1.05] drop-shadow-2xl">
                                Supercharge your <br />
                                <span className="relative inline-block mt-2">
                                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
                                        Admissions Process
                                    </span>
                                    <div className="absolute -bottom-2 left-0 w-full h-3 bg-indigo-500/20 blur-sm"></div>
                                </span>
                            </motion.h1>
                            
                            <motion.p variants={fadeInUp} className="text-base md:text-lg text-slate-400 font-medium max-w-xl leading-relaxed">
                                The ultimate AI-powered software platform. Capture leads from Facebook, WhatsApp, and your Website instantly. Automate counseling and boost conversions organically.
                            </motion.p>
                            
                            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 pt-4">
                                <button onClick={() => navigate('/login')} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
                                    Access Portal <ArrowRight size={18} />
                                </button>
                                <button onClick={() => navigate('/contact')} className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-600/50 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 backdrop-blur-md transition-all duration-300 flex items-center gap-3">
                                    <Bot size={18} className="text-emerald-400" /> Apply Now
                                </button>
                            </motion.div>

                            {/* Dense Trust Badges */}
                            <motion.div variants={fadeInUp} className="pt-8 border-t border-slate-800/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <div className="flex flex-col gap-1.5"><CheckCircle2 size={16} className="text-emerald-500" /> <span className="text-white text-xs">99.9%</span> Uptime SLA</div>
                                <div className="flex flex-col gap-1.5"><Globe2 size={16} className="text-blue-500" /> <span className="text-white text-xs">50+</span> Countries</div>
                                <div className="flex flex-col gap-1.5"><Zap size={16} className="text-amber-500" /> <span className="text-white text-xs">0.2s</span> Response</div>
                                <div className="flex flex-col gap-1.5"><Shield size={16} className="text-purple-500" /> <span className="text-white text-xs">256-bit</span> Security</div>
                            </motion.div>
                        </motion.div>

                        {/* RIGHT COLUMN: Highly Dense Overlapping Mockups */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}
                            className="relative w-full h-[550px] hidden xl:block"
                        >
                            {/* Main CRM Window */}
                            <div className="absolute right-0 top-10 w-[90%] h-[400px] bg-[#0a0f1c]/90 border border-slate-700/50 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden z-10">
                                {/* Header */}
                                <div className="h-12 border-b border-slate-800/80 flex items-center px-5 justify-between bg-slate-900/50">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-md">
                                        <Shield size={12} className="text-slate-400"/>
                                        <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">Admin Dashboard</span>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
                                        <Users size={12} className="text-indigo-400"/>
                                    </div>
                                </div>
                                {/* Content Dense Grid */}
                                <div className="flex-1 p-5 grid grid-cols-3 gap-5">
                                    <div className="col-span-1 space-y-3">
                                        {[
                                            { name: "WhatsApp API", msg: "New inquiry from Dubai", icon: <Smartphone size={14} className="text-emerald-400"/>, bg: "from-emerald-500/20 to-emerald-600/20", border: "border-emerald-500/30" },
                                            { name: "Facebook Ads", msg: "Lead form submitted", icon: <Facebook size={14} className="text-blue-400"/>, bg: "from-blue-500/20 to-blue-600/20", border: "border-blue-500/30" },
                                            { name: "AI Chatbot", msg: "Auto-qualified lead", icon: <Bot size={14} className="text-purple-400"/>, bg: "from-purple-500/20 to-purple-600/20", border: "border-purple-500/30" },
                                            { name: "Website Form", msg: "MBA application details", icon: <Globe2 size={14} className="text-amber-400"/>, bg: "from-amber-500/20 to-amber-600/20", border: "border-amber-500/30" }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-slate-800/40 border border-slate-700/30 rounded-xl p-3 flex items-center gap-3 hover:bg-slate-800/60 transition-colors cursor-pointer group">
                                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.bg} border ${item.border} flex-shrink-0 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="text-[10px] font-black text-slate-300 truncate">{item.name}</div>
                                                    <div className="text-[9px] font-bold text-slate-500 truncate mt-0.5">{item.msg}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-span-2 flex flex-col gap-4">
                                        <div className="flex gap-4 h-24">
                                            <div className="flex-1 bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex flex-col justify-center">
                                                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Total Leads</span>
                                                <span className="text-2xl font-black text-white">12,459</span>
                                            </div>
                                            <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col justify-center">
                                                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Conversion</span>
                                                <span className="text-2xl font-black text-white">24.8%</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-slate-800/30 rounded-xl border border-slate-700/30 p-4 relative overflow-hidden">
                                            {/* Fake Chart Lines */}
                                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-indigo-500/20 to-transparent"></div>
                                            <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                                <path d="M0 100 Q 20 60 40 80 T 80 40 T 100 20 L 100 100 Z" fill="rgba(99, 102, 241, 0.1)" stroke="rgba(99, 102, 241, 0.5)" strokeWidth="1"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Overlapping Notification Card */}
                            <motion.div 
                                animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-0 left-0 bg-slate-800/90 border border-slate-600 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-start gap-4 z-20 w-64"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50 mt-1 flex-shrink-0">
                                    <Bell size={18} className="text-blue-400 animate-bounce" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Facebook Ad Lead</p>
                                    <p className="text-xs font-bold text-white leading-tight mb-2">Priya submitted an inquiry for MBA in UK.</p>
                                    <div className="flex gap-2">
                                        <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[9px] rounded font-black uppercase">Auto-Replied</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Analytics Card */}
                            <motion.div 
                                animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-10 -left-10 bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30 w-56 flex items-center gap-4"
                            >
                                <div className="relative">
                                    <svg className="w-12 h-12 transform -rotate-90">
                                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                                        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={125.6} strokeDashoffset={125.6 * 0.15} className="text-emerald-500" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">85%</div>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Success Rate</p>
                                    <p className="text-sm font-black text-white text-emerald-400">+12.4% <TrendingUp size={12} className="inline"/></p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- INFINITE SCROLLING MARQUEE (TRUSTED BY) --- */}
            <div className="py-6 border-y border-slate-800/50 bg-[#02040a]/80 backdrop-blur-md overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#02040a] to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#02040a] to-transparent z-10"></div>
                <div className="flex gap-16 items-center w-max animate-[scroll_30s_linear_infinite]">
                    {/* Duplicating items to create infinite loop effect */}
                    {[...Array(2)].map((_, idx) => (
                        <React.Fragment key={idx}>
                            <div className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2"><Star size={14} className="text-amber-500"/> Harvard Univ</div>
                            <div className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2"><Globe2 size={14} className="text-blue-500"/> Oxford</div>
                            <div className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2"><Shield size={14} className="text-purple-500"/> Cambridge</div>
                            <div className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2"><Bot size={14} className="text-emerald-500"/> Stanford</div>
                            <div className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2"><Target size={14} className="text-indigo-500"/> MIT</div>
                            <div className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2"><BrainCircuit size={14} className="text-rose-500"/> Yale</div>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* --- PIPELINE SECTION (Ultra Dense) --- */}
            <section className="py-24 relative overflow-hidden bg-[#02040a]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0,transparent_100%)]"></div>
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="inline-block px-4 py-1.5 bg-slate-800/50 border border-slate-700 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                            End-to-End System
                        </motion.div>
                        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
                            A Seamless <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Workflow</span>
                        </motion.h2>
                        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-sm md:text-base text-slate-400 font-medium leading-relaxed">
                            A completely unified platform designed to take students from initial inquiry across all social platforms to final university enrollment smoothly.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {[
                            { title: "Multi-Channel Capture", desc: "Instantly capture leads from Facebook Ads, WhatsApp API, and Website Forms. Zero manual entry.", icon: <Globe2 size={24} />, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", glow: "shadow-[0_0_30px_rgba(59,130,246,0.1)]" },
                            { title: "AI Auto-Screening", desc: "Our AI bot chats with leads 24/7, qualifies their budget and interests, and categorizes them automatically.", icon: <Bot size={24} />, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30", glow: "shadow-[0_0_30px_rgba(168,85,247,0.1)]" },
                            { title: "Counselor Workspace", desc: "A unified inbox. Counselors can reply to WhatsApp, send documents, and track applications in one screen.", icon: <MessageSquare size={24} />, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/30", glow: "shadow-[0_0_30px_rgba(99,102,241,0.1)]" },
                            { title: "Enrollment & Analytics", desc: "Track conversions, manage finances, and generate beautiful ROI reports for your consultancy.", icon: <Target size={24} />, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30", glow: "shadow-[0_0_30px_rgba(16,185,129,0.1)]" }
                        ].map((step, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                                className={`p-8 rounded-3xl bg-slate-900/60 border ${step.border} hover:bg-slate-800 ${step.glow} hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group`}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 ${step.bg} rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150`}></div>
                                <div className={`w-14 h-14 rounded-2xl ${step.bg} ${step.color} border ${step.border} flex items-center justify-center mb-6 relative z-10`}>
                                    {step.icon}
                                </div>
                                <h3 className="text-lg font-black text-white mb-3 relative z-10">{step.title}</h3>
                                <p className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed relative z-10">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID (Ultra Dense) --- */}
            <section className="py-24 relative border-t border-slate-800/80 bg-[#050812]">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-8">
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                                <Activity size={12} /> Enterprise Grade
                            </motion.div>
                            
                            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                                Built exclusively for <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">High-Volume</span> Agencies
                            </motion.h2>
                            
                            <motion.p variants={fadeInUp} className="text-slate-400 text-sm md:text-base leading-relaxed">
                                Replace fragmented tools (Excel, WhatsApp Web, standalone CRMs) with our all-in-one software. Perfect for consultancies handling thousands of student inquiries globally.
                            </motion.p>
                            
                            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                                {[
                                    { icon: <BarChart3 size={20} className="text-indigo-400" />, title: "Real-time Reports", desc: "Live dashboard metrics" },
                                    { icon: <Clock size={20} className="text-purple-400" />, title: "Automated Workflows", desc: "Save 10+ hours a week" },
                                    { icon: <Shield size={20} className="text-emerald-400" />, title: "Role-Based Access", desc: "Control counselor limits" },
                                    { icon: <Sparkles size={20} className="text-amber-400" />, title: "Smart Analytics", desc: "AI predicted conversions" },
                                    { icon: <Smartphone size={20} className="text-blue-400" />, title: "WhatsApp API", desc: "Official meta integration" },
                                    { icon: <Globe2 size={20} className="text-rose-400" />, title: "Website Widget", desc: "Capture direct traffic" }
                                ].map((f, i) => (
                                    <div key={i} className="flex items-start gap-4 bg-slate-800/20 border border-slate-700/30 p-4 rounded-2xl hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                        <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700 group-hover:scale-110 transition-transform">{f.icon}</div>
                                        <div>
                                            <h4 className="text-xs font-black text-slate-200 mb-1">{f.title}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                        
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-[100px] opacity-20"></div>
                            <div className="bg-slate-900/80 border border-slate-700/50 rounded-3xl shadow-2xl p-8 backdrop-blur-xl relative">
                                <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                                    <div>
                                        <h3 className="font-black text-lg text-white">Pipeline Performance</h3>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Last 30 Days Data</p>
                                    </div>
                                    <div className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-black rounded-lg border border-emerald-500/20 flex items-center gap-2">
                                        <TrendingUp size={14}/> +42% Growth
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {[
                                        { label: "Raw Inquiries Captured", val: "18,459", w: "100%", color: "bg-blue-500", glow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]" },
                                        { label: "AI Qualified Leads", val: "12,210", w: "75%", color: "bg-indigo-500", glow: "shadow-[0_0_15px_rgba(99,102,241,0.5)]" },
                                        { label: "Counselor Processing", val: "8,840", w: "55%", color: "bg-purple-500", glow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]" },
                                        { label: "Successfully Enrolled", val: "3,205", w: "30%", color: "bg-emerald-500", glow: "shadow-[0_0_15px_rgba(16,185,129,0.5)]" }
                                    ].map((bar, i) => (
                                        <div key={i} className="space-y-2 group">
                                            <div className="flex justify-between text-xs font-black text-slate-300">
                                                <span>{bar.label}</span>
                                                <span className="text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{bar.val}</span>
                                            </div>
                                            <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                                                <motion.div 
                                                    initial={{ width: 0 }} whileInView={{ width: bar.w }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.2, ease: "easeOut" }}
                                                    className={`h-full ${bar.color} rounded-full ${bar.glow} relative`} 
                                                >
                                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-[shimmer_2s_infinite]"></div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Avg Cost/Lead</p>
                                        <p className="text-lg font-black text-white">$4.20</p>
                                    </div>
                                    <div className="border-x border-slate-800">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Active Agents</p>
                                        <p className="text-lg font-black text-white">24</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Conversion Time</p>
                                        <p className="text-lg font-black text-white">12 Days</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS SECTION --- */}
            <section className="py-24 relative bg-[#02040a] overflow-hidden">
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="inline-block px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
                            Success Stories
                        </motion.div>
                        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
                            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Industry Leaders</span>
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah Jenkins", role: "Director, GlobalEd", text: "This CRM completely transformed how we handle WhatsApp leads. Our counselors now respond 5x faster and our conversion rate jumped by 30%.", rating: 5 },
                            { name: "Amit Patel", role: "CEO, Future Study", text: "The AI Chatbot is a game changer. It pre-qualifies students while we sleep, so our team only talks to serious candidates the next morning.", rating: 5 },
                            { name: "Elena Rodriguez", role: "Admissions Head", text: "Finally, a software built specifically for educational consultancies. The pipeline tracking and role-based access are exactly what we needed to scale.", rating: 5 }
                        ].map((review, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                                className="bg-slate-900/50 border border-slate-700/50 rounded-3xl p-8 relative hover:bg-slate-800/80 hover:-translate-y-2 transition-all duration-300 group"
                            >
                                <div className="absolute top-0 right-8 -mt-5 bg-indigo-600 text-white w-10 h-10 flex items-center justify-center rounded-xl shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
                                    <MessageSquare size={18} />
                                </div>
                                <div className="flex gap-1 mb-6">
                                    {[...Array(review.rating)].map((_, j) => (
                                        <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-8 italic">"{review.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">{review.name}</h4>
                                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{review.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-24 relative bg-[#050812] border-t border-slate-800/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                            Frequently Asked <span className="text-indigo-400">Questions</span>
                        </motion.h2>
                        <p className="text-slate-400 font-medium">Everything you need to know about our platform and billing.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "How long does it take to setup?", a: "Most agencies are fully onboarded and capturing leads within 24 hours. Our team assists you with WhatsApp API and Facebook integration step-by-step." },
                            { q: "Do you integrate with official WhatsApp API?", a: "Yes, we use the official WhatsApp Cloud API. This means your numbers won't get banned, and you can send approved template messages for follow-ups." },
                            { q: "Is there a limit on the number of leads?", a: "Our enterprise plans offer unlimited lead capture. You only pay based on the number of counselor seats and active automated workflows." },
                            { q: "Can we restrict what our counselors see?", a: "Absolutely! The Super Admin can create specific roles and restrict counselors so they only see their assigned leads and cannot export your entire database." }
                        ].map((faq, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors"
                            >
                                <h3 className="text-lg font-bold text-white mb-2 flex items-start gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                                    {faq.q}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed pl-5">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION (Super Vibrant) --- */}
            <section className="py-16 relative overflow-hidden bg-slate-900 border-t border-slate-800">
                {/* Animated Background Gradients */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-emerald-600/20 rounded-full blur-[80px] animate-[spin_20s_linear_infinite]" />
                
                {/* Floating Elements in Background */}
                <motion.div animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-10 left-10 text-indigo-500/10"><Globe2 size={60} /></motion.div>
                <motion.div animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }} transition={{ duration: 7, repeat: Infinity }} className="absolute bottom-10 right-10 text-emerald-500/10"><Target size={80} /></motion.div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} 
                        className="bg-slate-900/90 border border-slate-700 p-8 md:p-12 rounded-[30px] backdrop-blur-2xl shadow-[0_0_50px_rgba(99,102,241,0.15)] relative overflow-hidden"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] animate-[shimmer_3s_infinite]" />

                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 transform -rotate-6 hover:rotate-0 transition-transform">
                            <Zap size={28} className="text-white" />
                        </div>
                        
                        <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                            Ready to <span className="text-indigo-400">transform</span> your agency?
                        </motion.h2>
                        
                        <motion.p variants={fadeInUp} className="text-slate-400 text-sm font-medium mb-8 max-w-xl mx-auto leading-relaxed">
                            Join top educational consultancies globally who are using our platform to scale their international student enrollments securely and effortlessly.
                        </motion.p>
                        
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4">
                            <button onClick={() => navigate('/login')} className="px-8 py-3.5 bg-white text-slate-900 hover:bg-indigo-50 hover:scale-105 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                Login to Portal <ArrowRight size={18} />
                            </button>
                            <button onClick={() => navigate('/contact')} className="px-8 py-3.5 bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 border border-indigo-500/50">
                                Contact Sales <Bot size={18} className="text-emerald-300" />
                            </button>
                        </motion.div>
                        
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500"/> No Credit Card</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500"/> Free 14-Day Trial</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500"/> Free Setup</span>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
