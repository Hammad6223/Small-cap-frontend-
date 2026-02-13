import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GET, UPDATE } from '../../api/AXIOS';
import { toast } from "react-toastify";

const FETCH_TRADE = 'fetchTrade';
const UPDATE_TRADE = 'updateTrade';

export const fetchTrade = createAsyncThunk(FETCH_TRADE, async () => {
  try {
    const response = await GET('trade_text');
    return response.data;
  } catch (error) {
    // console.error('Error fetching trade:', error);
    toast.error(error)
    throw error;
  }
});

export const updateTrade = createAsyncThunk(UPDATE_TRADE, async (data) => {
  try {
    const response = await UPDATE(`trade_text/${data.id}`, { text: data.text });
    toast.success("Trade Text Updated Sucessfully....");
    return response.data;
  } catch (error) {
    // console.error('Error updating trade:', error);
    toast.error(error)
    throw error;
  }
});

const tradeSlice = createSlice({
  name: 'Trade',
  initialState: {
    loading: false,
    submitting: false,
    tradeText: { _id: null, text: '' },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrade.fulfilled, (state, action) => {
        state.loading = false;
        state.tradeText = action.payload;
      })
      .addCase(fetchTrade.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrade.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateTrade.fulfilled, (state, action) => {
        state.submitting = false;
        state.tradeText = action.payload;
      })
      .addCase(updateTrade.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateTrade.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export const tradeActions = tradeSlice.actions;

export default tradeSlice.reducer;
