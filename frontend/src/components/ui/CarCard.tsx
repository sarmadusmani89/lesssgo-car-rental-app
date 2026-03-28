'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Fuel, Gauge, Snowflake, Users, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './Button';
import { RootState } from '@/lib/store';
import { toggleWishlist } from '@/lib/store/slices/wishlistSlice';

interface CarCardProps {
    id: string;
    slug?: string;
    name: string;
    brand: string;
    price: number;
    monthlyPrice?: number;
    status: string;
    hp: number;
    fuel: string;
    transmission: string;
    image: string;
    // New metadata
    passengers?: number;
    hasAC?: boolean;
    hasGPS?: boolean;
    freeCancellation?: boolean;
    vehicleClass?: string;
}

export default function CarCard({
    id, slug, name, brand, price, monthlyPrice, status, hp, fuel, transmission, image,
    passengers, hasAC, hasGPS, freeCancellation, vehicleClass
}: CarCardProps) {
    const currency = useSelector((state: RootState) => state.ui.currency);
    const rates = useSelector((state: RootState) => state.ui.rates);
    const wishlist = useSelector((state: RootState) => state.wishlist.items);
    const isWishlisted = wishlist.includes(id);
    const dispatch = useDispatch();

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleWishlist(id));
    };

    const isAvailable = status === 'AVAILABLE';
    const badgeText = isAvailable ? 'Instant Booking' : 'Reserved';

    return (
        <Link
            href={`/cars/${slug || id}`}
            className="block group bg-card rounded-[1.25rem] overflow-hidden border border-border transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) relative flex flex-col hover:-translate-y-2 hover:shadow-lg hover:border-accent cursor-pointer"
        >
            <div className="relative h-[240px] bg-muted/50 flex items-center justify-center overflow-hidden">
                <div className={`absolute top-4 left-4 py-[0.4rem] px-[0.8rem] rounded-md text-[10px] font-black uppercase tracking-wider text-accent-foreground z-[5] ${isAvailable ? 'bg-accent' : 'bg-muted-foreground'}`}>
                    {badgeText}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-4 right-4 bg-card rounded-full shadow-sm hover:scale-110 z-[5] ${isWishlisted ? 'text-red-500' : 'text-muted-foreground'}`}
                    onClick={handleToggleWishlist}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart size={20} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "currentColor"} />
                </Button>
                <div className="relative w-full h-full min-h-[200px]">
                    <Image
                        src={image || '/images/cars/placeholder.jpg'}
                        alt={`${brand} ${name}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority={false}
                        className="transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/50 to-transparent z-[2] pointer-events-none" />
            </div>

            <div className="p-7 flex-grow">
                <div className="flex items-baseline gap-2">
                    <span className="text-[11px] font-extrabold text-accent uppercase tracking-[1.2px] mb-2 block">{brand}</span>
                    {vehicleClass && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
                            {vehicleClass}
                        </span>
                    )}
                </div>
                <h3 className="line-clamp-1 text-2xl font-extrabold text-foreground mb-5 tracking-tight">{name}</h3>

                <div className="flex gap-4 mb-7 pb-6 border-b border-border">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
                        <Users size={16} className="text-accent" />
                        <span>{passengers || 4} Seats</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
                        <Fuel size={16} className="text-accent" />
                        <span>{fuel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
                        <Gauge size={16} className="text-accent" />
                        <span>{transmission}</span>
                    </div>
                    {hasAC && (
                        <div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground">
                            <Snowflake size={16} className="text-accent" />
                            <span>A/C</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-[13px] font-semibold text-muted-foreground mb-1">Daily Rate</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[1.75rem] font-black text-foreground leading-none">{formatPrice(price, currency, rates)}</span>
                            <span className="text-xs font-bold text-muted-foreground">/ day</span>
                        </div>
                        {monthlyPrice && (
                            <span className="text-[14px] font-bold text-accent mt-2">{formatPrice(monthlyPrice, currency, rates)} / month</span>
                        )}
                    </div>
                    <Button variant="primary" size="md" className="rounded-[10px] group-hover:shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
                        Details <ArrowRight size={18} />
                    </Button>
                </div>

                {freeCancellation && (
                    <div className="mt-3 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wider border border-emerald-100">
                        Free cancellation Upto 48h before Pickup time
                    </div>
                )}
            </div>
        </Link>
    );
}