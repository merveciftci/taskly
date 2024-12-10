import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    userName:  localStorage.getItem("userName") || "Hello!",
    isLoggedIn: !!localStorage.getItem("userName"),
  },
  reducers: {
    // eslint-disable-next-line no-unused-vars
    toggleLoggedIn: (state, action) => {
      state.isLoggedIn = !state.isLoggedIn;
    },
    updateUserName: (state, action) => {
      state.userName = action.payload;

      localStorage.setItem("userName", action.payload);
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
