import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

// Sub-components
import LocationField from './booking/LocationField';
import DateTimeField from './booking/DateTimeField';
import PriceSummary from './booking/PriceSummary';
import BookingHeader from './booking/BookingHeader';
import BookingButton from './booking/BookingButton';
import BookingFooter from './booking/BookingFooter';

// Styles
import styles from './BookingForm.module.css';

interface Props {
    car: {
        id: string;
        pricePerDay: number;
        pickupLocation?: string[];
        dropoffLocation?: string[];
    };
    defaultStartDate?: string;
    defaultEndDate?: string;
    onDatesChange?: (start: string, end: string) => void;
}

const TIME_OPTIONS = Array.from({ length: 13 * 2 + 1 }, (_, i) => {
    const totalMinutes = 9 * 60 + i * 30; // Start at 9:00
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 21) return null; // End at 21:00
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    return { label: time, value: time };
}).filter(Boolean) as { label: string; value: string }[];

export default function BookingForm({ car, defaultStartDate, defaultEndDate, onDatesChange }: Props) {
    const router = useRouter();
    const currency = useSelector((state: RootState) => state.ui.currency);
    const rates = useSelector((state: RootState) => state.ui.rates);

    const [pickupLocation, setPickupLocation] = useState('');
    const [returnLocation, setReturnLocation] = useState('');

    const [pickupDate, setPickupDate] = useState<Date | null>(defaultStartDate ? new Date(defaultStartDate) : null);
    const [pickupTime, setPickupTime] = useState('10:00');
    const [returnDate, setReturnDate] = useState<Date | null>(defaultEndDate ? new Date(defaultEndDate) : null);
    const [returnTime, setReturnTime] = useState('10:00');
    const [bookedDates, setBookedDates] = useState<Date[]>([]);
    const lastDatesRef = useRef({ start: '', end: '' });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await api.get(`/booking/car/${car.id}`);
                const dates: Date[] = [];
                data.forEach((booking: any) => {
                    let currentDate = new Date(booking.startDate);
                    const endDate = new Date(booking.endDate);
                    while (currentDate <= endDate) {
                        dates.push(new Date(currentDate));
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
                });
                setBookedDates(dates);
            } catch (error) {
                console.error("Failed to fetch car bookings", error);
            }
        };
        fetchBookings();
    }, [car.id]);

    useEffect(() => {
        if (onDatesChange && pickupDate) {
            const startISO = `${pickupDate.toISOString().split('T')[0]}T${pickupTime}`;
            const endISO = returnDate ? `${returnDate.toISOString().split('T')[0]}T${returnTime}` : '';

            if (lastDatesRef.current.start !== startISO || lastDatesRef.current.end !== endISO) {
                lastDatesRef.current = { start: startISO, end: endISO };
                onDatesChange(startISO, endISO);
            }
        }
    }, [pickupDate, pickupTime, returnDate, returnTime, onDatesChange]);

    useEffect(() => {
        if (pickupDate && returnDate && returnDate < pickupDate) {
            setReturnDate(pickupDate);
        }
    }, [pickupDate]);

    useEffect(() => {
        if (car.pickupLocation && car.pickupLocation.length > 0) {
            setPickupLocation(car.pickupLocation[0]);
        }
        if (car.dropoffLocation && car.dropoffLocation.length > 0) {
            setReturnLocation(car.dropoffLocation[0]);
        }
    }, [car]);

    // Sync internal state with props if they change externally
    useEffect(() => {
        if (defaultStartDate) {
            const datePart = new Date(defaultStartDate);
            setPickupDate(datePart);
            if (defaultStartDate.includes('T')) {
                setPickupTime(defaultStartDate.split('T')[1].substring(0, 5));
            }
        }
    }, [defaultStartDate]);

    useEffect(() => {
        if (defaultEndDate) {
            const datePart = new Date(defaultEndDate);
            setReturnDate(datePart);
            if (defaultEndDate.includes('T')) {
                setReturnTime(defaultEndDate.split('T')[1].substring(0, 5));
            }
        }
    }, [defaultEndDate]);

    const calculateTotal = () => {
        if (!pickupDate || !returnDate) return 0;

        // Get date parts only (ignore time for the daily count based on client request)
        const start = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate());
        const end = new Date(returnDate.getFullYear(), returnDate.getMonth(), returnDate.getDate());

        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Inclusive count: start date to end date (e.g., 9th to 19th is 11 days)
        const totalDays = diffDays + 1;

        return totalDays * car.pricePerDay;
    };

    const total = calculateTotal();
    const daysCount = total / car.pricePerDay;

    const handleBooking = () => {
        if (!pickupDate || !returnDate || !pickupLocation || !returnLocation) {
            toast.error("Please complete all booking details");
            return;
        }

        const startCombined = `${pickupDate.toISOString().split('T')[0]}T${pickupTime}`;
        const endCombined = `${returnDate.toISOString().split('T')[0]}T${returnTime}`;

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const checkoutUrl = `/checkout?id=${car.id}&startDate=${startCombined}&endDate=${endCombined}&pickupLocation=${encodeURIComponent(pickupLocation)}&dropoffLocation=${encodeURIComponent(returnLocation)}`;

        if (!token) {
            toast.info('Authenticating...', { description: 'Please sign in to proceed.' });
            router.push(`/auth/login?redirect=${encodeURIComponent(checkoutUrl)}`);
            return;
        }

        router.push(checkoutUrl);
    };

    return (
        <div className={styles.formContainer}>
            <BookingHeader
                pricePerDay={car.pricePerDay}
                currency={currency}
                rates={rates}
            />

            <div className={styles.content}>
                {/* Locations */}
                <div className={styles.locationGrid}>
                    <LocationField
                        label="Pick Up Location"
                        value={pickupLocation}
                        onChange={setPickupLocation}
                        options={car.pickupLocation}
                    />
                    <LocationField
                        label="Return Location"
                        value={returnLocation}
                        onChange={setReturnLocation}
                        options={car.dropoffLocation}
                    />
                </div>

                {/* Pick-Up Date & Time */}
                <DateTimeField
                    label="Pick-Up Date & Time"
                    dateValue={pickupDate}
                    timeValue={pickupTime}
                    onDateChange={setPickupDate}
                    onTimeChange={setPickupTime}
                    timeOptions={TIME_OPTIONS}
                    minDate={(() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 2);
                        return d;
                    })()}
                    excludeDates={bookedDates}
                    startDate={pickupDate}
                    endDate={returnDate}
                    selectsStart
                />

                {/* Return Date & Time */}
                <DateTimeField
                    label="Return Date & Time"
                    dateValue={returnDate}
                    timeValue={returnTime}
                    onDateChange={setReturnDate}
                    onTimeChange={setReturnTime}
                    timeOptions={TIME_OPTIONS}
                    minDate={(() => {
                        const d = pickupDate ? new Date(pickupDate) : new Date();
                        if (!pickupDate) d.setDate(d.getDate() + 2);
                        return d;
                    })()}
                    excludeDates={bookedDates}
                    startDate={pickupDate}
                    endDate={returnDate}
                    selectsEnd
                />

                <PriceSummary
                    days={daysCount}
                    total={total}
                    currency={currency}
                    rates={rates}
                />

                <BookingButton
                    onClick={handleBooking}
                    label="Book Now"
                />

                <BookingFooter />
            </div>

            {/* Background Decorations */}
            <div className={styles.decorationTop} />
            <div className={styles.decorationBottom} />

            <style jsx global>{`
                .react-datepicker-wrapper {
                    width: 100%;
                }
                .react-datepicker__input-container input {
                    width: 100%;
                }
                .react-datepicker-popper {
                    z-index: 50 !important;
                }
            `}</style>
        </div>
    );
}

