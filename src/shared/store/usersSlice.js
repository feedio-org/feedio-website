import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-hot-toast';

const initialState = {
  data: [],
  state: ""
};
export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.state = "pending";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.state = "success";
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.state = "failed";
        state.error = action.payload;
      });
  }
});


let OrgAPI={
  getUserById: ()=>{}
};

export const getUsers = createAsyncThunk('users/get', async(query) => {
  let data = await OrgAPI.getOrgUsers();
  return data['users'];

});


export default usersSlice.reducer;