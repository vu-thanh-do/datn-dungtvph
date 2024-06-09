import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IDrawerState {
  openDrawer: boolean
}

const initialState: IDrawerState = {
  openDrawer: false
}

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    setOpenDrawer: (state, action: PayloadAction<boolean>) => {
      state.openDrawer = action.payload
    }
  }
})

export const { setOpenDrawer } = drawerSlice.actions
export const drawerReducers = drawerSlice.reducer
