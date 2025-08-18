import { createSlice } from "@reduxjs/toolkit";

interface UserActiveRoleState {
  activeRole: string;
}

const initialState: UserActiveRoleState = {
  activeRole: "MLA", // default role
};

export const userActiveRoleSlice = createSlice({
  name: "userActiveRole/state",
  initialState,
  reducers: {
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
    },
  },
});

export const { setActiveRole } = userActiveRoleSlice.actions;

export const userActiveRoleState = (state: any) =>
  state?.userActiveRole?.activeRole;

export default userActiveRoleSlice.reducer;
