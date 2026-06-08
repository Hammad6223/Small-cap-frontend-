import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET, POSTFILE, PATCHFILE, DELETE } from '../../api/AXIOS';
import { toast } from "react-toastify";

const FETCH_NEWS = 'fetchNews';
const ADD_NEWS = 'addNews';
const UPDATE_NEWS = 'updateNews';
const DELETE_NEWS = 'deleteNews';

const buildFormData = (data) => {
  const formData = new FormData();
  const type = data.type || 'article';
  formData.append('title', data.title);
  formData.append('type', type);
  if (type === 'video') {
    formData.append('videoUrl', data.videoUrl || '');
    formData.append('content', '');
  } else {
    formData.append('content', data.content || '');
    formData.append('videoUrl', '');
    if (data.image) formData.append('image', data.image);
  }
  if (data.date) formData.append('date', data.date);
  return formData;
};

export const fetchNews = createAsyncThunk(FETCH_NEWS, async () => {
  try {
    const response = await GET('news');
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const addNews = createAsyncThunk(ADD_NEWS, async (data, { dispatch }) => {
  try {
    const response = await POSTFILE('news', buildFormData(data));
    toast.success(response.data.message || "News added successfully....");
    dispatch(fetchNews());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const updateNews = createAsyncThunk(UPDATE_NEWS, async ({ id, data }, { dispatch }) => {
  try {
    const response = await PATCHFILE(`news/${id}`, buildFormData(data));
    toast.success(response.data.message || "News updated successfully....");
    dispatch(fetchNews());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const deleteNews = createAsyncThunk(DELETE_NEWS, async (id, { dispatch }) => {
  try {
    const response = await DELETE(`news/${id}`);
    toast.success(response.data.message || "News deleted successfully....");
    dispatch(fetchNews());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

const newsSlice = createSlice({
  name: 'News',
  initialState: {
    loading: false,
    submitting: false,
    news: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNews.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addNews.pending, (state) => {
        state.submitting = true;
      })
      .addCase(addNews.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(addNews.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(updateNews.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateNews.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateNews.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(deleteNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNews.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteNews.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const newsActions = newsSlice.actions;

export default newsSlice.reducer;
