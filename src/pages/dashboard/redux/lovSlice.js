import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeApiRequest } from "../../../shared/api";

export const getBgImagesList = createAsyncThunk(
  "lov/getBgImagesList",
  async(thunkAPI) => {
    try {
      const response = await makeApiRequest("POST", {
        action: "get_background"
      });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const addNewCustomBg = createAsyncThunk(
  "lov/addNewCustomBg",
  async(fileName, thunkAPI) => {
    try {
      const response = await makeApiRequest("POST", {
        action: "add_background",
        ...fileName
      });

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const lovSlice = createSlice({
  name: "lov",
  initialState: {
    backgroundList: null,
    status: "idle",
    error: null,
    newBgStatus: "idle",
    newBgError: null,
    isNewBgAdded: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getBgImagesList cases
      .addCase(getBgImagesList.pending, (state) => {
        state.status = "loading";
        //   toast.loading('Creating course, please wait...');
      })
      .addCase(getBgImagesList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.backgroundList = action.payload;
        //   toast.success('Course created successfully!');
      })
      .addCase(getBgImagesList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        //   toast.error(`Failed to create course: ${action.payload}`);
      })
      .addCase(addNewCustomBg.pending, (state) => {
        state.newBgStatus = "loading";
        //   toast.loading('Creating course, please wait...');
      })
      .addCase(addNewCustomBg.fulfilled, (state, action) => {
        state.newBgStatus = "succeeded";
        state.isNewBgAdded = action.payload;
        //   toast.success('Course created successfully!');
      })
      .addCase(addNewCustomBg.rejected, (state, action) => {
        state.newBgStatus = "failed";
        state.newBgError = action.payload;
        //   toast.error(`Failed to create course: ${action.payload}`);
      });
  }
});

export default lovSlice.reducer;
