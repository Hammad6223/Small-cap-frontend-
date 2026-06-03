import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET, POST } from '../../api/AXIOS';
import { toast } from "react-toastify";

const SEND_NOTIFICATION = 'sendNotification';
const FETCH_NOTIFICATIONS = 'fetchNotifications';

export const sendNotification = createAsyncThunk(SEND_NOTIFICATION, async (data, { dispatch }) => {
  try {
    const response = await POST('notification', data);
    toast.success(response.data.message || "Notification sent successfully....");
    dispatch(fetchNotifications());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const fetchNotifications = createAsyncThunk(FETCH_NOTIFICATIONS, async () => {
  try {
    const response = await GET('notification');
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

const notificationSlice = createSlice({
  name: 'Notification',
  initialState: {
    loading: false,
    submitting: false,
    notifications: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })
      .addCase(sendNotification.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(sendNotification.pending, (state) => {
        state.submitting = true;
      })
      .addCase(sendNotification.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice.reducer;
