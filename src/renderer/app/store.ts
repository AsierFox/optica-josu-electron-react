import { configureStore } from '@reduxjs/toolkit';
import menuReducer from '../reducers/menuSliderReducer';

export const store = configureStore({
  reducer: {
    menuSlider: menuReducer,
  },
});

// Tipado del estado global
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
