import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenuSliderState {
  collapsed: boolean;
}

const initialState: MenuSliderState = {
  collapsed: false,
};

// Setting reducer and actions
const menuSliderSlice = createSlice({
  name: 'menuSlider',
  initialState,
  reducers: {
    toggleMenu: (state, action: PayloadAction<boolean>) => {
      state.collapsed = !action.payload;
    },
  },
});

export const { toggleMenu } = menuSliderSlice.actions;
export default menuSliderSlice.reducer;
