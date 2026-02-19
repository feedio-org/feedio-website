import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { makeApiRequest } from '../../../shared/api';
import { toast } from 'react-hot-toast';

export const previewVideoContent = createAsyncThunk(
  'course/previewVideoContent',
  async (topicId, thunkAPI) => {
    try {
      const response = await makeApiRequest('POST', {
        action: 'get_video_location',
        ...topicId
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const previewVideoSlice = createSlice({
  name: 'preview',
  initialState: {
    previewData: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // previewVideoContent cases
      .addCase(previewVideoContent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(previewVideoContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.previewData = action.payload;
      })
      .addCase(previewVideoContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(`Failed to generate video preview: ${action.payload}`);
      });
  }
});

export default previewVideoSlice.reducer;
