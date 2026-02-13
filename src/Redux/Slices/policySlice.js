import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET, UPDATE } from '../../api/AXIOS';
import { toast } from "react-toastify";

const FETCH_POLICY = 'fetchPolicy';
const UPDATE_POLICY = 'updatePolicy';

export const fetchPolicy = createAsyncThunk(FETCH_POLICY, async () => {
  try {
    const response = await GET('privacy_text');
    return response.data;
  } catch (error) {
    console.error('Error fetching policy:', error);
    toast.error(error)
    throw error;
  }
});

export const updatePolicy = createAsyncThunk(UPDATE_POLICY, async (data) => {
  try {
    const response = await UPDATE(`privacy_text/${data.id}`, { text: data.text });
    toast.success("Policy Text Updated Sucessfully....");
    return response.data;
  } catch (error) {
    // console.error('Error updating policy:', error);
    toast.error(error)
    throw error;
  }
});

const policySlice = createSlice({
  name: 'Policy',
  initialState: {
    loading: false,
    submitting: false,
    policyText: { _id: null, text: '' },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolicy.fulfilled, (state, action) => {
        state.loading = false;
        state.policyText = action.payload;
      })
      .addCase(fetchPolicy.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPolicy.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updatePolicy.fulfilled, (state, action) => {
        state.submitting = false;
        state.policyText = action.payload;
      })
      .addCase(updatePolicy.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updatePolicy.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export const policyActions = policySlice.actions;

export default policySlice.reducer;
