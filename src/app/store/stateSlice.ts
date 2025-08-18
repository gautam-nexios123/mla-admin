import { createSlice } from "@reduxjs/toolkit";
import { RootStateType } from "app/store/types";

type AppRootStateType = RootStateType<stateSliceType>;

type viewPanelState = {
  openGridView: boolean;
  openCheckoutView: boolean;
  openFullView: boolean;
  openConfirmView: boolean;
};

const initialState: viewPanelState = {
  openGridView: false,
  openCheckoutView: true,
  openFullView: false,
  openConfirmView: false,
};

/**
 * State slice for the view panel.
 */
export const stateSlice = createSlice({
  name: "viewPanel/state",
  initialState,
  reducers: {
    toggleViewPanel: (state) => {
      state.openGridView = !state.openGridView;
    },
    toggleCheckoutView: (state) => {
      if (state.openCheckoutView && state.openFullView) {
        state.openCheckoutView = true;
        state.openFullView = false;
      } else {
        state.openCheckoutView = !state.openCheckoutView;
        if (!state.openCheckoutView) {
          state.openFullView = false;
        }
      }
    },
    toggleConfirmView: (state) => {
      if (state.openConfirmView) {
        state.openConfirmView = false;
        state.openFullView = false;
        state.openCheckoutView = true;
      } else {
        state.openConfirmView = !state.openConfirmView;
        state.openFullView = true;
        state.openCheckoutView = true;
      }
    },
    toggleFullView: (state) => {
      if (!state.openCheckoutView && !state.openFullView) {
        state.openCheckoutView = true;
        state.openFullView = false;
      } else {
        state.openFullView = !state.openFullView;
        state.openCheckoutView = true;
      }
    },
  },
});

export const {
  toggleViewPanel,
  toggleCheckoutView,
  toggleFullView,
  toggleConfirmView,
} = stateSlice.actions;

export const selectGridViewPanelState = (state: any) =>
  state?.viewPanel?.openGridView;
export const selectCheckoutViewPanelState = (state: any) =>
  state?.viewPanel?.openCheckoutView;
export const selectFullViewPanelState = (state: any) =>
  state?.viewPanel?.openFullView;
export const selectConfirmPanelState = (state: any) =>
  state?.viewPanel?.openConfirmView;

export type stateSliceType = typeof stateSlice;

export default stateSlice.reducer;
