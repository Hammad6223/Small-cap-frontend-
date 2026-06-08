import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET, POST, UPDATE, DELETE } from '../../api/AXIOS';
import { toast } from "react-toastify";

const FETCH = 'fetchWatchLists';
const ADD = 'addWatchList';
const UPDATE_ = 'updateWatchList';
const DELETE_ = 'deleteWatchList';

export const fetchWatchLists = createAsyncThunk(FETCH, async () => {
  try {
    const response = await GET('watchlist');
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const addWatchList = createAsyncThunk(ADD, async (data, { dispatch }) => {
  try {
    const response = await POST('watchlist', data);
    toast.success(response.data.message || "Watch list added successfully....");
    dispatch(fetchWatchLists());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const updateWatchList = createAsyncThunk(UPDATE_, async ({ id, data }, { dispatch }) => {
  try {
    const response = await UPDATE(`watchlist/${id}`, data);
    toast.success(response.data.message || "Watch list updated successfully....");
    dispatch(fetchWatchLists());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const deleteWatchList = createAsyncThunk(DELETE_, async (id, { dispatch }) => {
  try {
    const response = await DELETE(`watchlist/${id}`);
    toast.success(response.data.message || "Watch list deleted successfully....");
    dispatch(fetchWatchLists());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

const watchlistSlice = createSlice({
  name: 'WatchList',
  initialState: {
    loading: false,
    submitting: false,
    watchLists: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchLists.fulfilled, (state, action) => {
        state.loading = false;
        state.watchLists = action.payload;
      })
      .addCase(fetchWatchLists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWatchLists.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addWatchList.pending, (state) => {
        state.submitting = true;
      })
      .addCase(addWatchList.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(addWatchList.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(updateWatchList.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateWatchList.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateWatchList.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(deleteWatchList.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteWatchList.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteWatchList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const watchlistActions = watchlistSlice.actions;

export default watchlistSlice.reducer;
