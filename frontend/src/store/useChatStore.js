import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {useAuthStore} from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessageLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get("/messages/users");
      set({ users: response.data });
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      set({ isMessageLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const response = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: [...messages, response.data] });
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      // You can add any finalization logic here if needed
    }
  },
  
  subscribeToMessages: () => {
    const {selectedUser}=get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    //Optimize this later, currently it is adding multiple listeners for the same event
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) {
        return;
      }
      if(newMessage.senderId !== selectedUser._id){
        return;
      }
      set({
        messages: [...get().messages, newMessage],
      })
    });
  },

  unSubscribefromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  //Optimize this one later-----
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));
