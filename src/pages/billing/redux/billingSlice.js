import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { makeApiRequest } from '../../../shared/api';
import { toast } from 'react-hot-toast';

export const getUsageQuota = createAsyncThunk(
  'course/getUsageQuota',
  async (topicId, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'billing_get_quota'
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const checkoutPricing = createAsyncThunk(
  'course/checkoutPricing',
  async (paymentPlan, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'create-checkout-session',
        ...paymentPlan
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const sessionStatus = createAsyncThunk(
  'course/sessionStatus',
  async (sessionId, thunkAPI) => {
    try {

      const response = await makeApiRequest('POST', {
        action: 'session_status',
        ...sessionId
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getBillingActivities = createAsyncThunk(
  'course/getBillingActivities',
  async (thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'billing_get_activities'
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const billingSlice = createSlice({
  name: 'billing',
  initialState: {
    usageQuota: null,
    status: 'idle',
    error: null,
    paymentSessionStatus: null,
    paySessionStatus: 'idle',
    paymentSessionStatusError: null,
    billingActivityList: null,
    billingActivityStatus: 'idle',
    billingActivityError: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getUsageQuota cases
      .addCase(getUsageQuota.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUsageQuota.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.usageQuota = action.payload;
      })
      .addCase(getUsageQuota.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Failed to fetch usage quota: ${action.payload}`);
      })

      // sessionStatus cases
      .addCase(sessionStatus.pending, (state) => {
        state.paySessionStatus = 'loading';
      })
      .addCase(sessionStatus.fulfilled, (state, action) => {
        state.paySessionStatus = 'succeeded';
        state.paymentSessionStatus = action.payload.data;
      })
      .addCase(sessionStatus.rejected, (state, action) => {
        state.paySessionStatus = 'failed';
        state.paymentSessionStatusError = action.payload;
        toast.error(
          `Failed to fetch payment session status: ${action.payload}`
        );
      })
      .addCase(getBillingActivities.pending, (state) => {
        state.billingActivityStatus = 'loading';
      })
      .addCase(getBillingActivities.fulfilled, (state, action) => {
        state.billingActivityStatus = 'succeeded';
        state.billingActivityList = action.payload.data;
      })
      .addCase(getBillingActivities.rejected, (state, action) => {
        state.billingActivityStatus = 'failed';
        state.billingActivityError = action.payload;
        toast.error(
          `Failed to fetch payment session status: ${action.payload}`
        );
      });
  }
});

export default billingSlice.reducer;
