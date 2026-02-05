import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
    items: string[]; // Array of car IDs
}

const initialState: WishlistState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        toggleWishlist: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            const index = state.items.indexOf(id);
            if (index >= 0) {
                state.items.splice(index, 1);
            } else {
                state.items.push(id);
            }
            if (typeof window !== 'undefined') {
                localStorage.setItem('wishlist', JSON.stringify(state.items));
            }
        },
        initializeWishlist: (state) => {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem('wishlist');
                if (stored) {
                    try {
                        state.items = JSON.parse(stored);
                    } catch (e) {
                        console.error("Failed to parse wishlist", e);
                    }
                }
            }
        }
    },
});

export const { toggleWishlist, initializeWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
