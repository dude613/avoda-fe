import { configureStore } from '@reduxjs/toolkit';
import orgReducer from "./slice/OrganizationUser"

const store = configureStore({
  reducer: {
    organization: orgReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
