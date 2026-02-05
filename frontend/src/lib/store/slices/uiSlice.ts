import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    currency: 'AUD' | 'PGK';
}

const initialState: UIState = {
    currency: 'AUD',
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setCurrency: (state, action: PayloadAction<'AUD' | 'PGK'>) => {
            state.currency = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('currency', action.payload);
            }
        },
        initializeCurrency: (state) => {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('currency') as 'AUD' | 'PGK';
                if (stored) state.currency = stored;
            }
        }
    },
});

export const { setCurrency, initializeCurrency } = uiSlice.actions;
export default uiSlice.reducer;
