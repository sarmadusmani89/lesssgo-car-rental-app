import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrencyRates {
    USD: number;
    PGK: number;
    AUD: number;
}

interface UIState {
    currency: 'AUD' | 'PGK' | 'USD';
    rates: CurrencyRates;
}

const initialState: UIState = {
    currency: 'PGK',
    rates: {
        AUD: 0.38,
        USD: 0.25,
        PGK: 1,
    }
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setCurrency: (state, action: PayloadAction<'AUD' | 'PGK' | 'USD'>) => {
            state.currency = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('currency', action.payload);
            }
        },
        setRates: (state, action: PayloadAction<CurrencyRates>) => {
            state.rates = action.payload;
        },
        initializeCurrency: (state) => {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('currency');
                if (stored === 'AUD' || stored === 'PGK' || stored === 'USD') {
                    state.currency = stored;
                } else {
                    state.currency = 'PGK';
                    localStorage.setItem('currency', 'PGK');
                }
            }
        }
    },
});

export const { setCurrency, initializeCurrency, setRates } = uiSlice.actions;
export default uiSlice.reducer;

