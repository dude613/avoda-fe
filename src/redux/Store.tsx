import { configureStore } from '@reduxjs/toolkit';
import orgReducer from "./slice/OrganizationUser"
import userProfileReducer from './slice/UserProfile';

const store = configureStore({
  reducer: {
    organization: orgReducer,
    userProfile: userProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
