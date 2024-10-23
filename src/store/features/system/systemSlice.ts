import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertModalProps, initialAlertModalState } from "@components/Modal/AlertModal";

interface SystemState {
  offcanvas: {
    show: boolean
  },
  alertModal?: AlertModalProps
}

// Define the initial state using that type
const initialState: SystemState = {
  offcanvas: {
    show: false
  },
  alertModal: initialAlertModalState
}

export const systemSlice = createSlice({
  name: "system",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setOffCanvas: (state, action: PayloadAction<any>) => {
      state.offcanvas = { ...state.offcanvas, ...action.payload}
    },
    setAlertModal: (state, action: PayloadAction<AlertModalProps>) => {
      state.alertModal = { ...state.alertModal, ...action.payload}
    },
  },
});

export const {
  setAlertModal,
  setOffCanvas
} = systemSlice.actions

export default systemSlice.reducer;
