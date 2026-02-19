import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCookie } from "cookies-next";
import { toast } from 'react-hot-toast';

const initialState = {
  data: {},
  state: ""
};
export const userByIdSlice = createSlice({
  name: "userById",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.state = "pending";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.data = action.payload;
        state.state = "success";
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload;
        toast.error(`Failed to fetch user details: ${action.payload}`);
      });
  }
});

let OrgAPI={
  getUserById: ()=>{}
};

export const getUserById = createAsyncThunk('user/get', async(query) => {
  let userId = getCookie('userId');
  let data = await OrgAPI.getUserById(userId);
  return data['user'];
});


export default userByIdSlice.reducer;