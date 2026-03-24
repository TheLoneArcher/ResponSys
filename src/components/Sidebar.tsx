import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, Users, ClipboardList, BarChart3, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Mock roles for now
    const role = 'admin';

    const links = [
        { name: 'Map', href: '/map', icon: Map, show: true },
        { name: 'Dispatch', href: '/tasks', icon: ClipboardList, show: true },
        { name: 'Volunteers', href: '/volunteers', icon: Users, show: role === 'admin' },
        { name: 'Analytics', href: '/analytics', icon: BarChart3, show: role === 'admin' },
    ];

    const sidebarContent = (
        <div className="flex h-full flex-col bg-surface border-r border-border text-text-primary">
            <div className="flex h-16 items-center flex-shrink-0 px-4 gap-3 bg-surface z-20">
                <div className="w-4 h-4 rounded-full bg-gold shrink-0"></div>
                <span className="font-semibold text-[15px] hidden md:block">ResponSys</span>
            </div>

            <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
                {links.filter(l => l.show).map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                                isActive
                                    ? "bg-surface-raised text-gold border-l-2 border-gold"
                                    : "text-text-secondary hover:bg-surface-raised hover:text-text-primary border-l-2 border-transparent"
                            )}
                        >
                            <Icon className={cn("flex-shrink-0 h-5 w-5", isActive ? "text-gold" : "text-text-secondary")} />
                            <span className="ml-3 hidden md:block">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            JD
                        </div>
                    </div>
                    <div className="ml-3 hidden md:block">
                        <p className="text-sm font-medium text-text-primary">John Doe</p>
                        <p className="text-xs font-medium text-text-secondary capitalize">{role}</p>
                    </div>
                </div>
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-transparent px-3 py-2 text-sm font-medium text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors hidden md:flex">
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-40 p-2 bg-surface rounded-md border border-border text-text-primary shadow-sm"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Drawer Overlay */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
                    <div className="relative flex w-[280px] flex-col bg-surface shadow-xl">
                        <div className="absolute top-4 right-4 z-50">
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-md text-text-secondary hover:bg-surface-raised">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {sidebarContent}
                    </div>
                </div>
            )}

            {/* Desktop/Tablet Sidebar */}
            <div className="hidden md:flex md:w-[64px] lg:w-[220px] md:flex-col fixed inset-y-0 h-screen z-30 transition-all duration-300">
                {sidebarContent}
            </div>
        </>
    );
}
