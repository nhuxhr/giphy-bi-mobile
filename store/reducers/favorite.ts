import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IFavoriteState {
  items: GiphyGIFObject[];
}

const initialState: IFavoriteState = {
  items: [],
};

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<GiphyGIFObject>) => {
      state.items = [...state.items, action.payload];
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(({ id }) => id !== action.payload);
    },
  },
});

export const { addFavorite, removeFavorite } = favoriteSlice.actions;
export const favorite = favoriteSlice.reducer;
