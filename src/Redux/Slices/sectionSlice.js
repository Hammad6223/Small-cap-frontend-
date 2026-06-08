import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET, POST, UPDATE, DELETE } from '../../api/AXIOS';
import { toast } from "react-toastify";

const FETCH_SECTIONS = 'fetchSections';
const ADD_SECTION = 'addSection';
const UPDATE_SECTION = 'updateSection';
const DELETE_SECTION = 'deleteSection';

export const fetchSections = createAsyncThunk(FETCH_SECTIONS, async () => {
  try {
    const response = await GET('section');
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const addSection = createAsyncThunk(ADD_SECTION, async (data, { dispatch }) => {
  try {
    const response = await POST('section', data);
    toast.success(response.data.message || "Section added successfully....");
    dispatch(fetchSections());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const updateSection = createAsyncThunk(UPDATE_SECTION, async ({ id, data }, { dispatch }) => {
  try {
    const response = await UPDATE(`section/${id}`, data);
    toast.success(response.data.message || "Section updated successfully....");
    dispatch(fetchSections());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

export const deleteSection = createAsyncThunk(DELETE_SECTION, async (id, { dispatch }) => {
  try {
    const response = await DELETE(`section/${id}`);
    toast.success(response.data.message || "Section deleted successfully....");
    dispatch(fetchSections());
    return response.data;
  } catch (error) {
    toast.error(error);
    throw error;
  }
});

const sectionSlice = createSlice({
  name: 'Section',
  initialState: {
    loading: false,
    submitting: false,
    sections: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload;
      })
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSections.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addSection.pending, (state) => {
        state.submitting = true;
      })
      .addCase(addSection.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(addSection.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(updateSection.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateSection.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(updateSection.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(deleteSection.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSection.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteSection.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const sectionActions = sectionSlice.actions;

export default sectionSlice.reducer;
