import {configureStore} from '@reduxjs/toolkit';
import {poolApi} from './poolApi';

export const store = configureStore({
  reducer: {
    [poolApi.reducerPath]: poolApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(poolApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
