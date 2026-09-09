import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  onlineUsers: [],
  socket: null,

  // =========================
  // CHECK AUTH
  // =========================
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({
        authUser: res.data,
      });

      // Auth milne ke baad socket connect
      get().connectSocket();
    } catch (error) {
      console.log("Error in CheckAuth:", error);

      set({
        authUser: null,
      });
    } finally {
      set({
        isCheckingAuth: false,
      });
    }
  },

  // =========================
  // SIGNUP
  // =========================
  signup: async (data) => {
    set({
      isSigningUp: true,
    });

    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({
        authUser: res.data,
      });

      toast.success("Account Created Successfully");

      // Signup ke baad socket connect
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({
        isSigningUp: false,
      });
    }
  },

  // =========================
  // LOGIN
  // =========================
  login: async (data) => {
    set({
      isLoggingIn: true,
    });

    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({
        authUser: res.data,
      });

      toast.success("Logged In Successfully");

      // Login ke baad socket connect
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({
        isLoggingIn: false,
      });
    }
  },

  // =========================
  // LOGOUT
  // =========================
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      get().disconnectSocket();

      set({
        authUser: null,
        onlineUsers: [],
      });

      toast.success("Logged Out Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  // =========================
  // UPDATE PROFILE
  // =========================
  updateProfile: async (data) => {
    set({
      isUpdatingProfile: true,
    });

    try {
      const res = await axiosInstance.put("/auth/update-profile", data);

      set({
        authUser: res.data,
      });

      toast.success("Profile Updated Successfully");
    } catch (error) {
      console.log("Error in UpdateProfile:", error);

      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({
        isUpdatingProfile: false,
      });
    }
  },

  // =========================
  // CONNECT SOCKET
  // =========================
  connectSocket: () => {
    const { authUser, socket } = get();

    // User nahi hai
    if (!authUser) return;

    // Already connected
    if (socket?.connected) return;

    const newSocket = io(BASE_URL, {
      withCredentials: true,
      query: {
        userId: authUser._id,
      },
    });

    // Socket connected
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    // Online users receive
    newSocket.on("getOnlineUsers", (onlineIds) => {
      console.log("Online users:", onlineIds);

      set({
        onlineUsers: onlineIds,
      });
    });

    // Socket error
    newSocket.on("connect_error", (error) => {
      console.log("Socket connection error:", error.message);
    });

    set({
      socket: newSocket,
    });
  },

  // =========================
  // DISCONNECT SOCKET
  // =========================
  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      socket.disconnect();
    }

    set({
      socket: null,
      onlineUsers: [],
    });
  },
}));
