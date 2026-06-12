import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET, POST, UPDATE, DELETE } from '../../api/AXIOS';
import { toast } from "react-toastify";

const FETCH_BANNERS = 'fetchBanners';
const ADD_BANNER = 'addBanner';
const UPDATE_BANNER = 'updateBanner';
const DELETE_BANNER = 'deleteBanner';

export const fetchBanners = createAsyncThunk(FETCH_BANNERS, async () => {
  try {
    const response = await GET('banner');
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const addBanner = createAsyncThunk(ADD_BANNER, async (data, { dispatch }) => {
  try {
    const response = await POST('banner', data);
    toast.success(response.data.message || "Banner added successfully....");
    dispatch(fetchBanners());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const updateBanner = createAsyncThunk(UPDATE_BANNER, async ({ id, data }, { dispatch }) => {
  try {
    const response = await UPDATE(`banner/${id}`, data);
    toast.success(response.data.message || "Banner updated successfully....");
    dispatch(fetchBanners());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const deleteBanner = createAsyncThunk(DELETE_BANNER, async (id, { dispatch }) => {
  try {
    const response = await DELETE(`banner/${id}`);
    toast.success(response.data.message || "Banner deleted successfully....");
    dispatch(fetchBanners());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

const bannerSlice = createSlice({
  name: 'Banner',
  initialState: {
    loading: false,
    submitting: false,
    banners: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanners.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addBanner.pending, (state) => {
        state.submitting = true;
      })
      .addCase(addBanner.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(addBanner.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(updateBanner.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateBanner.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateBanner.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBanner.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteBanner.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const bannerActions = bannerSlice.actions;

export default bannerSlice.reducer;
