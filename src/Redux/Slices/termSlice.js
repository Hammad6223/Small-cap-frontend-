import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET, UPDATE } from '../../api/AXIOS';
import { toast } from "react-toastify";

const FETCH_TERM = 'fetchTerm';
const UPDATE_TERM = 'updateTerm';

export const fetchTerm = createAsyncThunk(FETCH_TERM, async () => {
  try {
    const response = await GET('terms_condition');
    return response.data;
  } catch (error) {
    console.error('Error fetching term:', error);
    toast.error(error)
    throw error;
  }
});

export const updateTerm = createAsyncThunk(UPDATE_TERM, async (data) => {
  try {
    const response = await UPDATE(`terms_condition/${data.id}`, { text: data.text });
    toast.success("Term Text Updated Sucessfully....");
    return response.data;
  } catch (error) {
    // console.error('Error updating term:', error);
    toast.error(error)
    throw error;
  }
});

const termSlice = createSlice({
  name: 'Term',
  initialState: {
    loading: false,
    submitting: false,
    termText: { _id: null, text: '' },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTerm.fulfilled, (state, action) => {
        state.loading = false;
        state.termText = action.payload;
      })
      .addCase(fetchTerm.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTerm.rejected, (state,action) => {
        state.loading = false;
        console.error('Error in fetchDisclaimer:', action.payload);
      })
      .addCase(updateTerm.fulfilled, (state, action) => {
        state.submitting = false;
      })
      .addCase(updateTerm.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateTerm.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export const termActions = termSlice.actions;

export default termSlice.reducer;
