/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, type Socket } from "socket.io-client";
import {
  updateActiveTimer,
  clearActiveTimer,
  pauseActiveTimer,
  resumeActiveTimer,
  addTimerToHistory,
} from "../redux/slice/Timer";
import type { AppDispatch } from "../redux/Store";
import type { Timer } from "./timerApi";
import toast from "react-hot-toast";

let socket: Socket | null = null;
let dispatch: AppDispatch | null = null;

export const initializeSocket = (token: string, appDispatch: AppDispatch) => {
  if (socket) {
    socket.disconnect();
  }

  dispatch = appDispatch;

  // socket = io(`${baseUrl}/timer`, {
  //   auth: { token },
  // });
  socket = io("ws://localhost:8001/timers", {
    auth: {
      token: token,
    },
  });
  socket.on("connect", () => {
    console.log("Timer socket connected");
  });

  socket.on("connect_error", (error: any) => {
    console.error("Timer socket connection error:", error);
    toast.error("Failed to connect to timer service");
  });

  // Set up event handlers
  socket.on("timer:started", (timer: Timer) => {
    if (dispatch) {
      dispatch(updateActiveTimer(timer));
      toast.success(`Timer for "${timer.task}" has started`);
    }
  });

  socket.on("timer:stopped", (timer: Timer) => {
    if (dispatch) {
      dispatch(clearActiveTimer());
      dispatch(addTimerToHistory(timer));
      toast.success(`Timer for "${timer.task}" has stopped`);
    }
  });

  socket.on("timer:paused", (timer: Timer) => {
    if (dispatch) {
      dispatch(pauseActiveTimer(timer));
      toast.success(`Timer for "${timer.task}" has been paused`);
    }
  });

  socket.on("timer:resumed", (timer: Timer) => {
    if (dispatch) {
      dispatch(resumeActiveTimer(timer));
      toast.success(`Timer for "${timer.task}" has been resumed`);
    }
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
