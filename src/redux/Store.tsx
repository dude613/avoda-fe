/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from "@reduxjs/toolkit";
import orgReducer from "./slice/OrganizationUser";
import userProfileReducer from "./slice/UserProfile";
import timerReducer from "./slice/Timer";
import clientReducer from "./slice/ClientSlice";
import projectReducer from "./slice/ProjectSlice";
import clientAssignmentReducer from "./slice/ClientAssignmentSlice";
import taskReducer from "./slice/TaskSlice";

interface ClientAssignmentState {
  assignments: any[];
  loading: boolean;
  error: string | null;
}

const store = configureStore({
  reducer: {
    organization: orgReducer,
    userProfile: userProfileReducer,
    timer: timerReducer,
    clients: clientReducer,
    project: projectReducer,
    clientAssignments: clientAssignmentReducer,
    tasks: taskReducer, // Add the task reducer to the store
  },
});

export type RootState = ReturnType<typeof store.getState> & {
  clientAssignments: ClientAssignmentState;
};
export type AppDispatch = typeof store.dispatch;

export default store;
