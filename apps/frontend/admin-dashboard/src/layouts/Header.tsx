import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Search, Bell, User, UserCircle, Settings, LogOut } from "lucide-react";
import { getPageLabel } from "../utils/pageLabel";
import { useAuth0 } from "@auth0/auth0-react";

// Removed: import { useAuth0 } from "@auth0/auth0-react";

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const currentPage = getPageLabel(path);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    const { logout, user } = useAuth0();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfile(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="rounded-md p-2 text-slate-500 hover:bg-slate-100 md:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="hidden md:block text-slate-500 text-sm font-medium">
                    Admin Portal <span className="mx-2 text-slate-300">/</span> {currentPage}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="h-9 w-64 rounded-md border border-slate-300 bg-slate-50 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative rounded-full p-2 transition-colors ${showNotifications ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500 hover:text-indigo-600'}`}
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-900">Notifications</h3>
                                <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Mark all read</button>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                <div className="p-4 text-slate-500 text-sm">No new notifications.</div>
                            </div>
                            <div className="p-2 border-t border-slate-100 text-center">
                                <button className="text-sm text-slate-500 hover:text-slate-700 font-medium py-2 w-full">View all notifications</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile */}
                <div className="relative" ref={profileRef}>
                    <div
                        className="flex items-center gap-3 border-l border-slate-200 pl-4 cursor-pointer"
                        onClick={() => setShowProfile(!showProfile)}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        </div>
                        <button className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-white transition-colors ${showProfile ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                            {user.picture ? (
                                <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full" />
                            ) : (
                                <User className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-4 border-b border-slate-100">
                                <p className="font-medium text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                            <div className="p-1">
                                <button
                                    onClick={() => { navigate('/profile'); setShowProfile(false); }}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                >
                                    <UserCircle className="h-4 w-4" /> My Profile
                                </button>
                                <button
                                    onClick={() => { navigate('/settings'); setShowProfile(false); }}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                >
                                    <Settings className="h-4 w-4" /> Settings
                                </button>
                            </div>
                            {/* Sign Out button is now non-functional or can be removed */}
                            <div className="p-1 border-t border-slate-100">
                                <button
                                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-400 cursor-not-allowed"
                                >
                                    <LogOut className="h-4 w-4" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
export { Header };