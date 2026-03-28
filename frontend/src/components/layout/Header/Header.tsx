'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, User, Menu, X, LayoutDashboard, Globe } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { setCurrency } from '@/lib/store/slices/uiSlice';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const dispatch = useDispatch();
    const currency = useSelector((state: RootState) => state.ui.currency);

    const handleCurrencyChange = (newCurrency: 'AUD' | 'PGK' | 'USD') => {
        dispatch(setCurrency(newCurrency));
    };

    // Fetch dynamic rates on mount
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/settings/rates`);
                if (response.ok) {
                    const rates = await response.json();
                    dispatch({ type: 'ui/setRates', payload: rates });
                }
            } catch (error) {
                console.error('Failed to fetch currency rates:', error);
            }
        };

        fetchRates();
    }, [dispatch]);

    // Close dropdowns on path change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsCurrencyOpen(false);
    }, [pathname]);

    useEffect(() => {
        // Handle click outside for currency dropdown
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isCurrencyOpen && !target.closest('.currency-wrapper')) {
                setIsCurrencyOpen(false);
            }
        };

        if (isCurrencyOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCurrencyOpen]);

    useEffect(() => {
        // Check for user in localStorage
        const checkUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user", e);
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };

        checkUser();

        // Listen for storage events (logout/login in other tabs)
        window.addEventListener('storage', checkUser);
        // Listen for internal auth-logout events (token expiration in same tab)
        window.addEventListener('auth-logout', checkUser);

        return () => {
            window.removeEventListener('storage', checkUser);
            window.removeEventListener('auth-logout', checkUser);
        };
    }, [pathname]);

    // Close menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const dashboardLink = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

    const getCurrencyLabel = (curr: string) => {
        switch (curr) {
            case 'AUD': return 'AUD (A$)';
            case 'USD': return 'USD ($)';
            case 'PGK': return 'PGK (K)';
            default: return curr;
        }
    };

    return (
        <header className="flex items-center fixed top-4 lg:top-6 left-1/2 -translate-x-1/2 w-[92%] lg:w-[95%] max-w-[1400px] z-[1000] bg-background/80 backdrop-blur-3xl saturate-[180%] border border-border rounded-[100px] py-3 lg:py-4 px-4 lg:px-8 shadow-sm transition-all duration-400 hover:bg-background/95 hover:shadow-md">
            <div className="flex justify-between items-center w-full">
                <Link href="/" className="flex items-center gap-3 text-xl font-black text-primary tracking-[-1.5px] lowercase">
                    <img src="/web-logo-light.png" alt="Lesssgo Logo" className="h-10 lg:h-12 w-auto object-contain" />
                </Link>

                <nav className="hidden lg:flex gap-8">
                    {['Find Cars', 'How it Works', 'About Us'].map((item) => (
                        <Link 
                            key={item}
                            href={item === 'Find Cars' ? '/cars' : item === 'How it Works' ? '/how-it-works' : '/about'} 
                            className="font-semibold text-muted-foreground text-sm relative py-2 group transition-colors hover:text-primary"
                        >
                            {item}
                            <span className="absolute bottom-0 left-1/2 w-0 h-[3px] bg-accent rounded-full transition-all duration-300 -translate-x-1/2 group-hover:w-3" />
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    {/* Premium Currency Selector */}
                    <div className="hidden lg:block mr-2">
                        <div className="relative currency-wrapper">
                            <button
                                className="flex items-center gap-2 bg-background/50 border border-border px-4 py-2 rounded-[12px] text-xs font-extrabold text-foreground transition-all hover:bg-background hover:border-accent hover:shadow-sm"
                                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                            >
                                <Globe size={16} className="text-accent" />
                                <span>{getCurrencyLabel(currency)}</span>
                            </button>

                            {isCurrencyOpen && (
                                <div className="absolute top-[calc(100%+8px)] right-0 w-[140px] bg-card border border-border rounded-[16px] shadow-lg overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
                                    {(['AUD', 'USD', 'PGK'] as const).map((curr) => (
                                        <div
                                            key={curr}
                                            className={`p-3.5 text-sm font-semibold cursor-pointer transition-all hover:bg-muted hover:text-accent hover:pl-6 ${currency === curr ? 'text-foreground bg-muted font-extrabold' : 'text-muted-foreground'}`}
                                            onClick={() => {
                                                handleCurrencyChange(curr);
                                                setIsCurrencyOpen(false);
                                            }}
                                        >
                                            {getCurrencyLabel(curr)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="hidden lg:flex gap-2">
                        {user ? (
                            <Link href={dashboardLink} className="btn btn-primary flex items-center gap-2">
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/login" className="btn btn-outline">Log in</Link>
                                <Link href="/auth/signup" className="btn btn-primary">Sign up</Link>
                            </>
                        )}
                    </div>
                    
                    <button className="lg:hidden p-2 text-primary" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`fixed top-0 right-[-100%] w-4/5 max-w-[350px] h-screen bg-card z-[1000] transition-all duration-400 ease-in-out pt-24 px-8 pb-8 shadow-2xl ${isMenuOpen ? 'right-0' : ''}`}>
                <nav className="flex flex-col gap-6">
                    <div className="p-4 border-b border-border mb-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Currency</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['AUD', 'USD', 'PGK'] as const).map((curr) => (
                                <button
                                    key={curr}
                                    onClick={() => handleCurrencyChange(curr)}
                                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${currency === curr ? 'bg-accent/10 border-accent/20 text-accent font-black' : 'bg-muted border-border text-muted-foreground'}`}
                                >
                                    {curr}
                                </button>
                            ))}
                        </div>
                    </div>

                    {['Find Cars', 'How it Works', 'About Us'].map((item) => (
                        <Link 
                            key={item}
                            href={item === 'Find Cars' ? '/cars' : item === 'How it Works' ? '/how-it-works' : '/about'} 
                            className="text-xl font-bold text-primary tracking-tight"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}

                    <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-secondary">
                        {user ? (
                            <Link href={dashboardLink} className="btn btn-primary w-full flex items-center justify-center gap-2" onClick={() => setIsMenuOpen(false)}>
                                <LayoutDashboard size={18} />
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/login" className="btn btn-outline w-full text-center" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                                <Link href="/auth/signup" className="btn btn-primary w-full text-center" onClick={() => setIsMenuOpen(false)}>Sign up</Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>

            {/* Overlay */}
            {isMenuOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999] animate-in fade-in duration-300" onClick={() => setIsMenuOpen(false)} />}
        </header>
    );
}

