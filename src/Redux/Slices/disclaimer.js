import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET, UPDATE } from '../../api/AXIOS';
import { toast } from "react-toastify";

const FETCH_DISCLAIMER = 'fetchDisclaimer';
const UPDATE_DISCLAIMER = 'updateDisclaimer';

export const fetchDisclaimer = createAsyncThunk(FETCH_DISCLAIMER, async () => {
  try {
    const response = await GET('disclaimer_text');
    return response.data;
  } catch (error) {
    // console.error('Error fetching disclaimer:', error);
    toast.error(error)
    throw error;
  }
});

export const updateDisclaimer = createAsyncThunk(UPDATE_DISCLAIMER, async (data) => {
  try {
    const response = await UPDATE(`disclaimer_text/${data.id}`, { text: data.text });
    toast.success("Disclaimer Text Updated Sucessfully....");
    return response.data;
  } catch (error) {
    // console.error('Error updating disclaimer:', error);
    toast.error(error)
    throw error;
  }
});

const disclaimerSlice = createSlice({
  name: 'Disclaimer',
  initialState: {
    loading: false,
    submitting: false,
    disclaimerText: { _id: null, text: '' },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDisclaimer.fulfilled, (state, action) => {
        state.loading = false;
        state.disclaimerText = action.payload;
      })
      .addCase(fetchDisclaimer.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDisclaimer.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateDisclaimer.fulfilled, (state, action) => {
        state.submitting = false;
        state.disclaimerText = action.payload;
      })
      .addCase(updateDisclaimer.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateDisclaimer.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export const disclaimerActions = disclaimerSlice.actions;

export default disclaimerSlice.reducer;
