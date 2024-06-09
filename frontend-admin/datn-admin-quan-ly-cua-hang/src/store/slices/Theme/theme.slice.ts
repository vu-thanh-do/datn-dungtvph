import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface ITheme {
  theme: 'light' | 'dark'
}

const initialState: ITheme = {
  theme: JSON.parse(localStorage.getItem('color-theme')!)
}
export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    }
  }
})

export const { setTheme } = themeSlice.actions
export const themeReducer = themeSlice.reducer
